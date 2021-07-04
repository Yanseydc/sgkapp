import {  useCallback, useRef, useState } from "react";
import { useTokenStore } from '../../state/StateManager'
import { Notification } from '../../libs/notifications'
import axios from 'axios'
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";

function AddClientForm () {
    const jwt = useTokenStore( (state) => state.jwt );    

    const [client, setClient] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        referenceName: '',
        referencePhone: '',
        birthDate: '',
        image64: '',
     });  

    const webcamRef = useRef(null);
    const history = useHistory();

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
            
            history.push("/");

            Notification({ title: 'Exitoso', message: res.data.message, type: 'success'});
            
        } catch(error) {
            let message = error.response ? error.response.data.message : 'Servidor apagado';
            let statusText = error.response? error.response.statusText : 'Servidor apagado';
            Notification({ title: statusText, message, type: 'danger'}); 
        }
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setClient({
            ...client,
            image64: imageSrc
        });
    }, []);

    return (
        <form onSubmit={addClient}>
            <div className="row">
                <div className="col">
                    <Webcam
                        className="webcam"
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        
                    />                              
                </div>
                <div className="col">   
                    <div className="image">        
                    {
                        !client.image64 ?
                        <i className="fas fa-image fa-8x"></i>
                    :                                
                        <img src={client.image64}  alt="Foto del cliente"/>                        
                    } 
                    </div>
                </div>
                <button type="button" className="button blue" onClick={capture}>Capture photo</button>
            </div>                

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
    );
}

export default AddClientForm;