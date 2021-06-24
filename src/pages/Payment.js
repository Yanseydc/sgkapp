import axios from "axios";
import { useEffect, useState } from "react";
import { useAxiosStore, useTokenStore } from "../state/StateManager";

function Payment ({ match }) {
    const clientId = match.params.id;
    const jwt = useTokenStore( (state) => state.jwt );
    const loading = useAxiosStore( (state) => state.loading );
    const setLoading = useAxiosStore( (state) => state.setLoading );
    const [plans, setPlans] = useState([]);
    const [client, setClient] = useState({});
    const [form, setForm] = useState({
        clientId,
        plan: '',
        newCost: '',
        entryDate: ''
    });
    
    useEffect(() => {        
        if(loading) {
            getPlans();
            getClient();
        }
        //set min date
        let sixMonths = 6;
        let date = new Date();        
        let minDate = date.setMonth( date.getMonth() - sixMonths);
        document.querySelector("#entryDate").min = new Date(minDate).toISOString().split("T")[0];
        document.querySelector("#entryDate").max = new Date().toISOString().split("T")[0];
    }, []);

    const getPlans = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/plans");
            setPlans(res.data);            
        } catch(error) {
            console.error(" get plans error", error);
        }
    }

    const getClient = async () => {
        try {                    
            const res = await axios.get(`http://localhost:4000/api/clients/${clientId}`);
            setClient(res.data);            
            setLoading(false);            
        } catch(error) {
            console.error(" get plans error", error);
        }
    }

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addPayment = async () => {
        try {            
            const options = {
                method: 'POST',
                headers: { 
                  'content-type': 'application/json',
                  'x-access-token': jwt
                },
                data: form,
                url: 'http://localhost:4000/api/clients/payment'
              };
      
            const response = await axios(options);
            
            console.log(response);

        } catch(error) {
            console.error(error);
            // let message;
            // if(error.response) {
            //     message = error.response.data.message ;                
            // } else {
            //     message = 'El servidor esta apagado'                
            // }

            // setSigninError({
            //     ...signInError,
            //     message,
            //     hasError: true
            // });            
        }
    }

    return (
        <div className="payment">
            <div className="payment__container">
                <div className="form">
                    <h1>Realizar Pago</h1>
                    <h5>Cliente: {client.firstName} {client.lastName}</h5>
                    <div className="row">                                            
                        <div className="col">
                            <div className="form-input">
                                <label htmlFor="plan">Selecciona un plan:</label>
                                <select name="plan" onChange={handleInputChange}>
                                    <option>select a plan</option>
                                    { loading 
                                    ? <option>Loading...</option>
                                    : plans.map( (plan) => 
                                            <option key={plan._id} value={plan._id}>{plan.name} - {plan.cost}</option>
                                        )
                                    }   
                                </select>                                
                            </div>
                        </div>

                        <div className="col">
                            <div className="form-input">
                                <label htmlFor="newCost">otra cantidad:</label>
                                <input type="text" name="newCost" onChange={handleInputChange}/>      
                            </div>
                        </div>
                    </div>

                    <div className="row">                            
                        <div className="col">
                            <div className="form-input">
                                <label htmlFor="entryDate">Fecha de ingreso:</label>
                                <input id="entryDate" type="date" name="entryDate" max="2021-07-01" onChange={handleInputChange}/>
                            </div>
                        </div>
                    </div>

                    <button className="btn" onClick={addPayment}>Guardar pago</button>

                </div>
            </div>
        </div>
    );
}


export default Payment;