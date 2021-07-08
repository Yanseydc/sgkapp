import {  useCallback, useRef } from "react";
import { useTokenStore, useClientStore } from '../../state/StateManager'
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";

function AddClientForm () {
    const jwt = useTokenStore( (state) => state.jwt );
    const removeToken = useTokenStore( (state) => state.removeToken );
    const client = useClientStore( (state) => state.client);
    const setClient = useClientStore( (state) => state.setClient);
    const createClient = useClientStore( (state) => state.createClient);

    const webcamRef = useRef(null);
    const history = useHistory();

    const handleInputChange = (e) => {
        let key = e.target.name;
        let value = e.target.value;
        value = e.target.name === 'entryDate' ? value.replaceAll("-","/") : value;
        setClient(key, value);
    };

    const addClient = async (e) => {
        e.preventDefault()
        try {
            await createClient(jwt, client);            
            history.push("/");
        } catch(error) {
            if(error.response.data.name == 'JsonWebTokenError') {
                removeToken();
            }
        }        
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setClient('imagePath', imageSrc);
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
                        !client.imagePath ?
                        <i className="fas fa-image fa-8x"></i>
                    :                                
                        <img src={client.imagePath}  alt="Foto del cliente"/>                        
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