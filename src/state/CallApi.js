import axios from "axios";
import { Notification } from "../libs/notifications"
import { useAxiosStore, useTokenStore } from "./StateManager";


// let setLoading = useAxiosStore( state => state.setLoading);
const CallApi = async (url, method, data, jwt) => {
    const options = {
        method,
        headers: { 
            'content-type': 'application/json',
            'x-access-token': jwt
        },
        data,
        url
    };

    try {
        useAxiosStore.getState().setLoading(true);
        let response = await axios(options);
        useAxiosStore.getState().setLoading(false);
        //if method is not GET should be a notification success notification
        if(method !== 'GET' && !url.includes('signin') ) {
            let message = response ? response.data.message : '';
            Notification({ title: 'Exitoso', message: message, type: 'success'});
        } else {
            //if method is get request should return data
            return response;
        }
    } catch(error) {
        useAxiosStore.getState().setLoading(false);
        let message;
        let statusText;
        let errorName;
        if(error.response) {
            message = error.response.data.message;
            statusText = error.response.statusText;
            errorName = error.response.data.name;
        } else {
            message = 'Servidor apagado';
            statusText = 'Error en servidor'
        }

        if(errorName == 'JsonWebTokenError' || errorName == 'TokenExpiredError') {
            useTokenStore.getState().removeToken();
        }
        
        Notification({ title: statusText, message, type: 'danger'}); 
        throw error; //this is to catch an error in the called function
    }
}

export default CallApi;