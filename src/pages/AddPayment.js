import { useEffect, useState } from "react";
import Box from "../components/Box/Box";
import AddPaymentForm from "../components/AddForms/AddPaymentForm";
import { Link } from "react-router-dom";
import { useTokenStore, useClientStore, useAxiosStore} from "../state/StateManager";


function AddPayment ({ match }) {
    const clientId = match.params.id;
    const jwt = useTokenStore( (state) => state.jwt );
    const removeToken = useTokenStore( (state) => state.removeToken );
    const getPayment = useClientStore( (state) => state.getPayment);
    const payed = useClientStore( (state) => state.hasPayment);
    const client = useClientStore( (state) => state.client);
    const loading = useAxiosStore( state => state.loading);

    useEffect(async () => {
        try {
            await getPayment(jwt, clientId); 
        } catch(error) {
            if(error.response?.data.name == 'JsonWebTokenError') {
                removeToken();
            }
        }
    }, []);

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