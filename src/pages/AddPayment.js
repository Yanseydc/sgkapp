import { useEffect, useState } from "react";
import Box from "../components/Box/Box";
import AddPaymentForm from "../components/AddForms/AddPaymentForm";
import { Notification } from './../libs/notifications';
import axios from "axios";
import { Link } from "react-router-dom";


function AddPayment ({ match }) {
    const clientId = match.params.id;
    const [client, setClient] = useState({});
    const [loading, setLoading] = useState(true);
    const [payed, setPayed] = useState(true);

    useEffect(() => {
        if(loading) {
            getPayment();
        }

    }, []);

    const getPayment = async () => {
        try {                    
            const res = await axios.get(`http://localhost:4000/api/clients/${clientId}`);            
            setClient(res.data);
            setLoading(false);
            
            if(res.data.lastPayment) {                
                let currentDate = new Date().getTime();
                let registerDate = new Date(`${res.data.lastPayment}`);
                let nextPayment = new Date(registerDate.setMonth( registerDate.getMonth() + res.data.months)).getTime();
                if(currentDate >= nextPayment) {              
                    setPayed(false);
                }
            } else {
                setPayed(false);
            }
            
        } catch(error) {
            let message = error.response ? error.response.data.message : 'Servidor apagado';
            let statusText = error.response? error.response.statusText : 'Servidor apagado';
            Notification({ title: statusText, message, type: 'danger'}); 
        }
    }

    return (
        <div className="addPayment">
        { loading 
            ? 
                <h4>Loading...</h4>
            : 
                (payed 
                    ?
                        <>
                        <h4 className="addPayment__title">El cliente <span>{client.firstName} {client.lastName}</span> esta al corriente con su pago</h4>
                        <Link to="/">Volver a la tabla de clientes</Link>
                        </>
                    :
                        <Box title="Realizar Pago">
                            <AddPaymentForm client={client}/>
                        </Box>
                )
        }
       </div>
    );
}


export default AddPayment;