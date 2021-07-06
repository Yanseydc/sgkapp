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

    useEffect( () => {
        getClientById(jwt, clientId);
    }, []); 

    return (
        <div className="view">
            <div className="view__content">
                <div className="client-edit">
                    {/* <div className="column"> */}
                        <Box title="Informacion del cliente">
                            <EditClientForm />
                        </Box>
                    {/* </div>                 */}
                </div>
                <div className="client-registers">
                    {/* <div className="column"> */}
                        <Box className="payments" title="Registro de pagos">
                            <ul>
                                {
                                    payments.map( payment => <li key={payment._id}>{payment.entryDate}</li>)
                                }
                            </ul>
                        </Box>
                    {/* </div> */}
                    {/* <div className="column"> */}
                        <Box title="Registro de entradas">
                            <ul>
                                {
                                    checkIns.map( checkIn => <li key={checkIn._id}>{checkIn.createdAt}</li>)
                                }
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                                <li>asd</li>
                            </ul> 
                        </Box>
                    {/* </div> */}
                </div> 
            </div>           
        </div>
    )
}

export default ViewClient;