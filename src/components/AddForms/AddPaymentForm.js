import { useEffect, useState } from "react";
import { Notification } from '../../libs/notifications';
import { useTokenStore } from "../../state/StateManager";

import axios from "axios";
import { useHistory } from "react-router-dom";


function AddPaymentForm(props) {
    const client = props.client;
    const clientId = client._id;
    
    const jwt = useTokenStore( (state) => state.jwt );

    const [form, setForm] = useState({
        clientId,
        months: '',
        cost: '',
        entryDate: ''
    });

    const history = useHistory();
    
    useEffect(() => {        
        //set min date
        let sixMonths = 6;
        let date = new Date();        
        let minDate = date.setMonth( date.getMonth() - sixMonths);
        document.querySelector("#entryDate").min = new Date(minDate).toISOString().split("T")[0];
        document.querySelector("#entryDate").max = new Date().toISOString().split("T")[0];
    }, []);
    

    const handleInputChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const addPayment = async (e) => {        
        e.preventDefault();        
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
      
            const res = await axios(options);
            
            Notification({ title: 'Exitoso', message: res.data.message, type: 'success'});

            history.push("/");
            
            
        } catch(error) {
            let message = error.response ? error.response.data.message : 'Servidor apagado';
            let statusText = error.response? error.response.statusText : 'Servidor apagado';
            Notification({ title: statusText, message, type: 'danger'});            
        }
    }

    return (
        <>
            <form onSubmit={addPayment}>
                <h1>{props.title}</h1>
                <h5>Cliente: {client.firstName} {client.lastName}</h5>
                <div className="row">                                            
                    <div className="col">
                        <div className="form-input">
                            <label htmlFor="months">Meses #:</label>
                            <input type="number" min="1" max="12" name="months" onChange={handleInputChange} placeholder="Ingrese los meses pagados" required="required"/>
                        </div> 
                    </div>

                    <div className="col">
                        <div className="form-input">
                            <label htmlFor="cost">Costo:</label>
                            <input type="text" name="cost" onChange={handleInputChange} placeholder="Ingrese el costo total" required="required"/>      
                        </div>
                    </div>
                </div>

                <div className="row">                            
                    <div className="col">
                        <div className="form-input">
                            <label htmlFor="entryDate">Fecha de ingreso:</label>
                            <input id="entryDate" type="date" name="entryDate" max="2021-07-01" onChange={handleInputChange} required="required"/>
                        </div>
                    </div>
                </div>

                <input type="submit" className="btn" value ="Guardar pago" />
            </form>
        </>
    );
}

export default AddPaymentForm;