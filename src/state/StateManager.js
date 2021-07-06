import axios from 'axios';
import create from 'zustand';
import { devtools } from 'zustand/middleware'
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

// let userStore = (set) => ({
//     username: '',
// });

let clientStore = (set, get) => ({ 
    clients: [],
    client: {
        _id: '',
        firstName:'',
        lastName:'',
        email:'',
        phone:'',
        birthDate:'',
        referenceName:'',
        referencePhone:'',
        imagePath:'',
        createdAt:'',
        updatedAt:''
    },
    payments: [],
    checkIns: [],
    setClient: (key, value) => set( (state) => ({ client: {...state.client, [key]: value} })),
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
    getClient: async (jwt, id) => {
        try {
            const options = {
                method: 'GET',
                headers: { 
                    'content-type': 'application/json',
                    'x-access-token': jwt
                },
                url: `http://localhost:4000/api/clients/${id}`
            };
        
            let response = await axios(options);
            let { client, payments, checkIns} = response.data;
            set({ 
                client: client,
                payments: payments,
                checkIns: checkIns
            });
        } catch(error) {
            console.error('get clientid error', error);
        }
    },
    createClient: async (jwt, newClient) => {
        try {            
            const options = {
                method: 'POST',
                headers: { 
                    'content-type': 'application/json',
                    'x-access-token': jwt
                },
                data: newClient,
                url: 'http://localhost:4000/api/clients'
            };
            
            await axios(options);
            
        } catch(error) {
            console.log(error);
        }
    }, 
    updateClient: async (jwt) => {
        try {
            
            const options = {
                method: 'PUT',
                headers: { 
                    'content-type': 'application/json',
                    'x-access-token': jwt
                },
                data: get().client,
                url: `http://localhost:4000/api/clients/${get().client._id}`
            };
            
            await axios(options);
            
        } catch(error) {
            console.log(error);
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
                clients: state.clients.filter(client => client._id !== id)
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
