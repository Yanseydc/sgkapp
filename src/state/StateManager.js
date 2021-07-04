import axios from 'axios';
import create from 'zustand';
import { devtools, persist } from 'zustand/middleware'
const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let tokenStore = (set) => ({
    jwt: localStorage.getItem("jwt"),
    addToken: () => set( () => ({ jwt: localStorage.getItem("jwt") }) ),
    removeToken: () => set( () => ({ jwt: localStorage.clear() }) ),
});

let axiosStore = (set) => ({
    loading: true,
    setLoading: (value) => set( () => ({ loading: value }))
})

let userStore = (set) => ({
    username: '',
});

let clientStore = (set) => ({ 
    clients: [],
    getClients: async () => {
        try {

            let response = await axios.get("http://localhost:4000/api/clients");

            const data = response.data.map(client => {
                let paymentDescription = 'Corriente';
                if(!client.lastPayment) { 
                    paymentDescription = 'Pendiente';
                }
                if(client.lastPayment) {
                    let currentDate = new Date().getTime();
                    let registerDate = new Date(`${client.lastPayment}`);
                    let nextPayment = new Date(registerDate.setMonth( registerDate.getMonth() + client.months)).getTime();
                    if(currentDate >= nextPayment) {              
                        paymentDescription = 'Deudor';
                    }
                }
                return {
                    ...client,
                    lastPayment: client.lastPayment ? new Date(`${client.lastPayment}`).toLocaleDateString('es-Es', dateOptions) : '',
                    status: paymentDescription
                };
            });

            set({ clients: data });            
        } catch(error) {
            console.error(error);
        }
    },
    removeClient: async (jwt, id) => {
        try {
            const options = {
                method: 'DELETE',
                headers: { 
                    'content-type': 'application/json',
                    'x-access-token': jwt
                },
                url: `http://localhost:4000/api/clients/${id}`
            };
        
            await axios(options);

            set( (state) => ({
                clients: state.clients.filter(client => client._id != id)
            }));
        } catch(error) {
            console.log(error);
        }                        
    }, 
    checkIn: async (jwt, id) => {
        try {        
            const options = {
                method: 'POST',
                headers: { 
                    'content-type': 'application/json',
                    'x-access-token': jwt
                },
                data: { clientId: id },
                url: 'http://localhost:4000/api/clients/checkIn'
            };

            await axios(options);
            
        } catch (error) {
            console.error('error', error);
        }
    }
});

// tokenStore = devtools(tokenStore);/
// axiosStore = devtools(axiosStore);
clientStore = devtools(clientStore);

export const useTokenStore = create(tokenStore);
export const useAxiosStore = create(axiosStore);
export const useClientStore = create(clientStore);
