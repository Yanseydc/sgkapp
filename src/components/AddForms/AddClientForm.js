import {  useCallback, useEffect, useRef } from "react";
import { useTokenStore, useClientStore } from '../../state/StateManager'
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";
import alertify from 'alertifyjs';

function AddClientForm () {
    const jwt = useTokenStore( (state) => state.jwt );
    const removeToken = useTokenStore( (state) => state.removeToken );
    const client = useClientStore( (state) => state.client);
    const setClient = useClientStore( (state) => state.setClient);
    const createClient = useClientStore( (state) => state.createClient);
    const resetClient = useClientStore( (state) => state.clearClientStore);

    const webcamRef = useRef(null);
    const history = useHistory();

    useEffect( () => {
        resetClient();
    }, []);

    const handleInputChange = (e) => {
        let key = e.target.name;
        let value = e.target.value;
        value = key === 'entryDate' ? value.replaceAll("-","/") : value;
        value = key === 'phone' || key === 'referencePhone' ? validateNumber(value) : value;
        setClient(key, value);
    };

    const addClient = async (e) => {
        e.preventDefault();
        alertify.confirm(`Crear Cliente`, `Estas seguro de crear nuevo cliente?`, 
            async function() {
                try {
                    await createClient(jwt, client);            
                    history.push("/");
                } catch(error) {
                    if(error.response.data.name === 'JsonWebTokenError') {
                        removeToken();
                    }
                }  
            },
            function() {}
        );              
    }

    const capture = useCallback(() => {
        let screenShot = webcamRef.current.getScreenshot();
        const imageSrc = screenShot ? screenShot : '' ;
        setClient('imagePath', imageSrc);
    });

    const validateNumber = (value) => {
        return value.replace(/[^0-9\.]+/g, '');;
    }
    return (
        <form onSubmit={addClient}>
            <div className="row">
                <div className="col">
                    <div className="takePhoto">
                        <div className="camera">
                            <Webcam
                                className="webcam"
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                
                            />                              
                        </div>
                
                        <div className="image">        
                            {
                                !client.imagePath ?
                                <i className="fas fa-image fa-8x"></i>
                            :                                
                                <img src={client.imagePath}  alt="Foto del cliente"/>                        
                            } 
                        </div>
                    </div> 
                    <button type="button" className="button blue btn-take-photo" onClick={capture}>Capture photo</button>               
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="firstName">Nombre:</label>
                        <input id="firstName" placeholder="Ingresa nombre(s) del cliente" type="text" name="firstName" onChange={handleInputChange} value={client.firstName} required="required" />
                    </div>
                </div>

                <div className="col">
                    <div className="form-input">
                        <label htmlFor="lastName">Apellidos:</label>
                        <input id="lastName" placeholder="Ingresa apellidos del cliente" type="text" name="lastName" onChange={handleInputChange} value={client.lastName} required="required" />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="phone">Telefono:</label>
                        <input id="phone" placeholder="Ingresa telefono del cliente" type="text" name="phone" maxLength="10" onChange={handleInputChange} value={client.phone}/>
                    </div>
                </div>
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="email">Correo:</label>
                        <input id="email" placeholder="Ingresa correo del cliente" type="email" name="email" onChange={handleInputChange} value={client.email}/>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="referenceName">Referencia personal:</label>
                        <input id="referenceName" placeholder="Ingresa referencia personal del cliente" type="text" name="referenceName" onChange={handleInputChange} value={client.referenceName}/>
                    </div>
                </div>
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="referencePhone">Telefono de referencia:</label>
                        <input id="referencePhone" placeholder="Ingresa telefono de referencia del cliente" type="text" name="referencePhone" onChange={handleInputChange} value={client.referencePhone}/>
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