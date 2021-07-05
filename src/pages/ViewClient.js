import { useEffect } from "react";
import { useClientStore, useTokenStore } from './../state/StateManager';
import EditClientForm from './../components/EditForms/EditClientForm'
import Box from './../components/Box/Box';
function ViewClient(props) {
    let clientId = props.match.params.id;
    let getClientById = useClientStore( (state) => state.getClient );
    let jwt = useTokenStore( (state) => state.jwt );
    // let client = useClientStore( (state) => state.client );

    useEffect( () => {
        getClientById(jwt, clientId);
    }, []); 

    return (
        <div className="view">
            <div className="view__content">
                <div className="view-first-column">
                    formulario 1
                    <Box title="Client">
                        <EditClientForm />
                    </Box>
                    {/* {client} */}
                </div>
                <div className="view-second-column">
                    <div className="payments">
                        <ul>
                            <li>payment 1</li>
                        </ul>
                    </div>
                    <div className="checkIns">
                        <ul>
                            <li>check in 1</li>
                        </ul>
                    </div>
                </div>
            </div>            
        </div>
    )
}

export default ViewClient;