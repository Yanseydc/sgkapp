import { useEffect, useState } from "react";
import { useClientStore, useTokenStore } from "../../state/StateManager";
import { useHistory } from "react-router-dom";


function AddPaymentForm(props) {
    const client = props.client;
    const clientId = client._id;
    
    const jwt = useTokenStore( (state) => state.jwt );
    const createPayment = useClientStore( (state) => state.createPayment);

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
        let currentDate = new Date(new Date().toLocaleDateString()).toISOString().split("T")[0];
        document.querySelector("#entryDate").min = new Date(minDate).toISOString().split("T")[0];
        document.querySelector("#entryDate").max = currentDate;
    }, []);
    

    const handleInputChange = (e) => {
        let key = e.target.name;
        let value = e.target.value;
        setForm({
            ...form,
            [key]: value
        });
    };

    const addPayment = async (e) => {        
        e.preventDefault();                
        await createPayment(jwt, form);            
        history.push("/");         
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
                            <input type="number" name="cost" onChange={handleInputChange} placeholder="Ingrese el costo total" required="required"/>      
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