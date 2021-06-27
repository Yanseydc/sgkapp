import { store } from 'react-notifications-component';

export const Notification = ({message, type}) => {    
    store.addNotification({
        title: 'Exitoso',
        message,
        type,
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
    });
}