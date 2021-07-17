import {  useCallback, useEffect, useRef, useState } from "react";
import { useTokenStore, useClientStore, useAxiosStore } from '../../state/StateManager'
import Webcam from "react-webcam";
import alertify from 'alertifyjs';

function EditClientForm () {
    const jwt = useTokenStore( (state) => state.jwt );
    const client = useClientStore( (state) => state.client );
    const setClient = useClientStore( (state) => state.setClient );
    const update = useClientStore( (state) => state.updateClient );
    const webcamRef = useRef(null);
    const [isNewPicture, setIsNewPicture] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [cameraConnected, setCameraConnected] = useState(false);

    useEffect( () => {
        disableInputs();
    }, []);

    const handleInputChange = (e) => {
        let key = e.target.name;
        let value = e.target.value;
        value = e.target.name === 'entryDate' ? value.replaceAll("-","/") : value;
        setClient(key, value);
    };

    const editClient = (e) => {
        e.preventDefault();
        let inputs = document.querySelectorAll('input:not([type=submit])');
        inputs.forEach(input => {
            input.removeAttribute('disabled');
        }); 
        setIsEditing(true);
    };

    const updateClient = (e) => {
        e.preventDefault();
        alertify.confirm(`Actualizar Cliente`, `Deseas actualizar al cliente?`, 
            async function() {                
                await update(jwt);
                setIsEditing(false);
                disableInputs(); 
            },
            function() {}
        );
    }

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setClient('imagePath', imageSrc);
        setIsNewPicture(true);
    }, []);

    const getDate = () => {
        if(client?.birthDate) {
            let birthDate = new Date(client.birthDate);
            let year = birthDate.getFullYear();
            let month = birthDate.getMonth()+1;
            let day = birthDate.getDay();
            let fullYear = `${year}-${month > 9 ? month : '0'+month}-${day > 9 ? month : '0'+day}`;
            return fullYear;
        }
        return '';
    }

    const disableInputs = () => {
        //make all input disbaled
        let inputs = document.querySelectorAll('input:not([type=submit])');
        inputs.forEach(input => {
            input.setAttribute('disabled', true);
        });  
    }

    //callback for when component can't receive a media stream with MediaStreamError param
    const userMediaError = () => {
        setCameraConnected(true);
    }

    const userMediaSuccess = () => {
        setCameraConnected(false);
    }

    return (
        <form >
            <div className="row">
                <div className="col">
                    <div className="takePhoto">
                        <div className="camera">
                            { cameraConnected
                            ?   <h4>Connec't a camera</h4>
                            :   <Webcam
                                    className="webcam"
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    onUserMediaError={userMediaError} 
                                    onUserMedia={userMediaSuccess}                             
                                />
                            }                              
                        </div>
                
                        <div className="image">        
                    {
                        !client.imagePath 
                        ?   <i className="fas fa-image fa-8x"></i>
                        :   ( !isNewPicture 
                            ?   <img src={ "http://localhost:4000/static/" + client?.imagePath }  alt="Foto del cliente"/>
                            :   <img src={client.imagePath}  alt="Foto del cliente"/>
                        )
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
                        <input id="firstName" placeholder="Ingresa nombre(s) del cliente" type="text" name="firstName" onChange={handleInputChange} value={client?.firstName} required="required" />
                    </div>
                </div>

                <div className="col">
                    <div className="form-input">
                        <label htmlFor="lastName">Apellidos:</label>
                        <input id="lastName" placeholder="Ingresa apellidos del cliente" type="text" name="lastName" onChange={handleInputChange} value={client?.lastName} required="required" />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="phone">Telefono:</label>
                        <input id="phone" placeholder="Ingresa telefono del cliente" type="text" name="phone" onChange={handleInputChange} value={client?.phone}/>
                    </div>
                </div>
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="email">Correo:</label>
                        <input id="email" placeholder="Ingresa correo del cliente" type="email" name="email" onChange={handleInputChange} value={client?.email}/>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="referenceName">Referencia personal:</label>
                        <input id="referenceName" placeholder="Ingresa referencia personal del cliente" type="text" name="referenceName" onChange={handleInputChange} value={client?.referenceName}/>
                    </div>
                </div>
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="referencePhone">Telefono de referencia:</label>
                        <input id="referencePhone" placeholder="Ingresa telefono de referencia del cliente" type="text" name="referencePhone" onChange={handleInputChange} value={client?.referencePhone}/>
                    </div>
                </div>
            </div>

            <div className="row">                            
                <div className="col">
                    <div className="form-input">
                        <label htmlFor="birthDate">Fecha de nacimiento:</label>
                        <input id="birthDate" type="date" name="birthDate" min="1950-01-01" max="2000-01-01" onChange={handleInputChange} value={getDate()}/>
                    </div>
                </div>
            </div>
            { isEditing 
                ? <input type="submit" className="btn" value="Actualizar Cliente" onClick={updateClient}/>
                : <input type="submit" className="btn" value="Editar" onClick={editClient}/>
            }
        </form>
    );
}

export default EditClientForm;