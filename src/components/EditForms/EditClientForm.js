import {  useCallback, useEffect, useRef } from "react";
import { useClientStore } from '../../state/StateManager'
import { Notification } from '../../libs/notifications'
import Webcam from "react-webcam";
import { useHistory } from "react-router-dom";

function EditClientForm () {
    
    const client = useClientStore( (state) => state.client );
    const webcamRef = useRef(null);
    const history = useHistory();

    const handleInputChange = (e) => {
        console.log(e.target);
        // e.target.value = e.target.name === 'birthDate' ? e.target.value.replaceAll("-","/") : e.target.value;
        // setClient({
        //     ...client,
        //     [e.target.name]: e.target.value
        // });
    };

    const editClient = () => {
        console.log('edit client');
    };

    const getDate = () => {
        if(client?.birthDate) {
            let birthDate = new Date(client.birthDate);
            let year = birthDate.getFullYear();
            let month = birthDate.getMonth()+1;
            let day = birthDate.getDay();
            let fullYear = `${year}-${month > 9 ? month : '0'+month}-${day > 9 ? month : '0'+day}`;
            console.log('fullYear: ',  fullYear);
            return fullYear;
        }
        return '';
    }

    const capture = useCallback(() => {
        // const imageSrc = webcamRef.current.getScreenshot();
        // setClient({
        //     ...client,
        //     image64: imageSrc
        // });
    }, []);

    return (
        <form >
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
                        <img src={ "http://localhost:4000/static/" + client?.imagePath }  alt="Foto del cliente"/>                        
                    } 
                    </div>
                </div>
                <button type="button" className="button blue" onClick={capture}>Capture photo</button>
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
            <input type="submit" className="btn" value="Registrar cliente" />
        </form>
    );
}

export default EditClientForm;