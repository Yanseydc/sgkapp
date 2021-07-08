import axios from 'axios';
import create from 'zustand';
import { devtools } from 'zustand/middleware'
import CallApi from './CallApi';

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
    getClients: async (jwt) => {
        let response = await CallApi(
            `http://localhost:4000/api/clients`, 
            'GET',
            '',
            jwt
        ); 
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
    },
    getClient: async (jwt, id) => {
        let response = await CallApi(
            `http://localhost:4000/api/clients/${id}`, 
            'GET',
            '',
            jwt
        );
        let { client, payments, checkIns} = response.data;
        set({ 
            client: client,
            payments: payments,
            checkIns: checkIns
        });
    },
    createClient: async (jwt, newClient) => {
        await CallApi(
            `http://localhost:4000/api/clients`, 
            'POST',
            newClient,
            jwt
        ); 
    }, 
    updateClient: async (jwt) => {
        await CallApi(
            `http://localhost:4000/api/clients/${get().client._id}`, 
            'PUT',
            get().client,
            jwt
        );        
    }, 
    removeClient: async (jwt, id) => {
        await CallApi(
            `http://localhost:4000/api/clients/${id}`, 
            'DELETE',
            '',
            jwt
        );

        set( (state) => ({
            clients: state.clients.filter(client => client._id !== id)
        }));                             
    }, 
    checkIn: async (jwt, id) => {
        await CallApi(
            `http://localhost:4000/api/clients/checkIn`, 
            'POST',
            { clientId: id },
            jwt
        );
    }
});

// tokenStore = devtools(tokenStore);/
// axiosStore = devtools(axiosStore);
clientStore = devtools(clientStore);

export const useTokenStore = create(tokenStore);
export const useAxiosStore = create(axiosStore);
export const useClientStore = create(clientStore);
