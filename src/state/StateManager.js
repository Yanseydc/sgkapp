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
    hasPayment: true,
    payments: [],
    checkIns: [],
    clearClientStore: () => {
        Object.keys(get().client).forEach(key => {
            get().setClient(key, '');
        });  
    },
    setClient: (key, value) => set( (state) => ({ client: {...state.client, [key]: value} })),
    getClients: async (jwt) => {
        let response = await CallApi(
            `${process.env.REACT_APP_CLIENTS_API}`, 
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
            `${process.env.REACT_APP_CLIENTS_API}${id}`, 
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
    getPayment: async (jwt, id) => {
        let response = await CallApi(
            `${process.env.REACT_APP_CLIENTS_API}${id}`, 
            'GET',
            '',
            jwt
        );
        let { firstName, lastName} = response.data.client;
        let payments = response.data.payments;
    
        get().setClient('firstName', firstName);
        get().setClient('lastName', lastName);
        get().setClient('_id', id);
        // let lastPayment = payments.length == 0 ? '' : payments[0].entryDate;
        set({hasPayment: true});
        if(payments.length > 0) { 
            let { entryDate: lastPayment, months} = payments[0];       
            let currentDate = new Date().getTime();
            let registerDate = new Date(`${lastPayment}`);
            let nextPayment = new Date(registerDate.setMonth( registerDate.getMonth() + months)).getTime();
            if(currentDate >= nextPayment) {              
                set({hasPayment: false});
            }
        } else {
            set({hasPayment: false});
        }
    },
    createClient: async (jwt, newClient) => {
        await CallApi(
            process.env.REACT_APP_CLIENTS_API, 
            'POST',
            newClient,
            jwt
        ); 
    }, 
    createPayment: async (jwt, data) => {
        await CallApi(
            process.env.REACT_APP_CLIENTS_API+'/payment', 
            'POST',
            data,
            jwt
        ); 
    }, 
    updateClient: async (jwt) => {
        await CallApi(
            `${process.env.REACT_APP_CLIENTS_API}${get().client._id}`, 
            'PUT',
            get().client,
            jwt
        );        
    }, 
    removeClient: async (jwt, id) => {
        await CallApi(
            `${process.env.REACT_APP_CLIENTS_API}${id}`, 
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
            `${process.env.REACT_APP_CLIENTS_API}checkIn`, 
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
