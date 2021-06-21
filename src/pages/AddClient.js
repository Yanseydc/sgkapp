function AddMember() {
    return (
        <div className="addClient">
            <div className="addClient__container">
                {/* <div className="addClient__form"> */}
                    <div className="form">
                        <h1>Agregar Cliente</h1>
                        <div className="row">
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="name">Nombre:</label>
                                    <input id="name" type="text" name="name" required="required" />
                                </div>
                            </div>

                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="lastName">Apellidos:</label>
                                    <input id="lastName" type="text" name="lastName" required="required" />
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="phone">Telefono:</label>
                                    <input id="phone" type="text" name="phone" required="required" />
                                </div>
                            </div>
                            
                            <div className="col">
                                <div className="form-input">
                                    <label htmlFor="plan">Plan:</label>
                                    <select>
                                        <option>Mensual</option>
                                        <option>Bimestral</option>
                                        <option>Semestral</option>
                                        <option>Libre</option>
                                    </select>
                                    {/* <input id="plan" type="text" name="plan" required="required" /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
    );    
}

export default AddMember;