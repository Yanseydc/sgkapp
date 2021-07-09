import axios from "axios";
import { Notification } from "../libs/notifications"

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
        let response = await axios(options);
        //if method is not GET should be a notification success notification
        if(method != 'GET') {
            let message = response ? response.data.message : '';
            Notification({ title: 'Exitoso', message: message, type: 'success'});
        } else {
            //if methos is get should return data
            return response;
        }
    } catch(error) {
        let message = error.response ? error.response.data.message : 'Servidor apagado';
        let statusText = error.response? error.response.statusText : 'Servidor apagado';
        Notification({ title: statusText, message, type: 'danger'}); 
        throw error; //this is to catch an error in the called function
    }
};



export default CallApi;