import {  useState } from "react";
import { useTokenStore } from '../state/StateManager'
import axios from 'axios'
import { Notification } from './../libs/notifications'

function AddMember() {
    const jwt = useTokenStore( (state) => state.jwt );    
    const [client, setClient] = useState({
       firstName: '',
       lastName: '',
       phone: '',
       email: '',
       referenceName: '',
       referencePhone: '',
       birthDate: ''
    });   

    const handleInputChange = (e) => {
        setClient({
            ...client,
            [e.target.name]: e.target.value
        });
    };

    const addClient = async (e) => {
        e.preventDefault()
        try {            
            const options = {
                method: 'POST',
                headers: { 
                  'content-type': 'application/json',
                  'x-access-token': jwt
                },
                data: client,
                url: 'http://localhost:4000/api/clients'
              };
      
            const res = await axios(options);

            e.target.reset(); // reset state

            Notification({message: res.data.message, type: 'success'});
            
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
        <div className="addClient">
            <div className="addClient__container">                
                <h1>Agregar Cliente</h1>
                <div className="form">
                    <form onSubmit={addClient}>
                        <div className="row">
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="firstName">Nombre:</label>
                                    <input id="firstName" placeholder="Ingresa nombre(s) del cliente" type="text" name="firstName" onChange={handleInputChange} required="required" />
                                </div>
                            </div>

                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="lastName">Apellidos:</label>
                                    <input id="lastName" placeholder="Ingresa apellidos del cliente" type="text" name="lastName" onChange={handleInputChange} required="required" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="phone">Telefono:</label>
                                    <input id="phone" placeholder="Ingresa telefono del cliente" type="text" name="phone" onChange={handleInputChange}/>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="email">Correo:</label>
                                    <input id="email" placeholder="Ingresa correo del cliente" type="email" name="email" onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="referenceName">Referencia personal:</label>
                                    <input id="referenceName" placeholder="Ingresa referencia personal del cliente" type="text" name="referenceName" onChange={handleInputChange}/>
                                </div>
                            </div>
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="referencePhone">Telefono de referencia:</label>
                                    <input id="referencePhone" placeholder="Ingresa telefono de referencia del cliente" type="text" name="referencePhone" onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>

                        <div className="row">                            
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="birthDate">Fecha de nacimiento:</label>
                                    <input id="birthDate" type="date" name="birthDate" min="1950-01-01" max="2000-01-01" onChange={handleInputChange}/>
                                </div>
                            </div>
                        </div>
                        <input type="submit" className="btn" value="Registrar cliente" />
                    </form>
                </div>
            </div>
        </div>
    );    
}

export default AddMember;