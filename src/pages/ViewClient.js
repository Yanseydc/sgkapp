import { useEffect } from "react";
import { useClientStore, useTokenStore } from './../state/StateManager';
import EditClientForm from './../components/EditForms/EditClientForm'
import Box from './../components/Box/Box';

function ViewClient(props) {
    let clientId = props.match.params.id;
    let getClientById = useClientStore( (state) => state.getClient );
    let jwt = useTokenStore( (state) => state.jwt );
    let payments = useClientStore( (state) => state.payments);
    let checkIns = useClientStore( (state) => state.checkIns);
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "numeric", hour12: true};

    useEffect( () => {
        getClientById(jwt, clientId);
    }, [jwt, clientId, getClientById]); 

    const getDate = (date) => {
        return new Date(`${date}`).toLocaleDateString('es-Es', dateOptions);
    }

    return (
        <div className="view">
            <div className="view__content">
                <div className="client-edit">                    
                    <Box title="Informacion del cliente">
                        <EditClientForm />
                    </Box>                    
                </div>
                <div className="client-registers">                    
                    <Box className="payments" title="Registro de pagos">
                        <ol>
                            {
                                payments.map( payment => <li key={payment._id}>{getDate(payment.entryDate)}</li>)
                            }
                        </ol>
                    </Box>                
                
                    <Box title="Registro de entradas">
                        <ol>
                            {
                                checkIns.map( checkIn => <li key={checkIn._id}>{getDate(checkIn.createdAt)}</li>)
                            }
                        </ol> 
                    </Box>                    
                </div> 
            </div>           
        </div>
    )
}

export default ViewClient;