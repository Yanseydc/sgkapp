function AddMember() {
    return (
        <div className="container">
            <div className="block">
                <h1 className="title">Add Member</h1>
            </div>
            <form className="block box ">
                <div className="columns">
                    <div className="field column">
                        <label className="label">Name</label>
                        <div className="control">
                            <input className="input" type="text" placeholder="First Name" />
                        </div>
                    </div>
                    <div className="field column">
                        <label className="label">Last name</label>
                        <div className="control">
                            <input className="input" type="text" placeholder="Last Name" />
                        </div>
                    </div>
                </div>

                <div className="columns">
                    <div className="field column">
                        <label className="label">Email</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="email" placeholder="john.doe@example.com" />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-envelope"></i>
                                </span>
                                <span className="icon is-small is-right is-hidden">
                                    <i className="fas fa-exclamation-triangle"></i>
                                </span>
                        </div>
                        <p className="help is-danger is-hidden">This email is invalid</p>
                    </div>

                    <div className="field column">
                        <label className="label">Phone</label>
                        <div className="control has-icons-left has-icons-right">
                            <input className="input" type="email" placeholder="664-192-8156" />
                                <span className="icon is-small is-left">
                                    <i className="fas fa-phone"></i>
                                </span>                                
                        </div>                        
                    </div>
                </div>

                <div className="columns">
                    <div className="field column">
                        <label className="label">Plan</label>
                        <div className="control">
                            <div className="select ">
                                <select>
                                    <option>Select Plan</option>
                                    <option>1 month</option>
                                    <option>2 months</option>
                                    <option>3 months</option>
                                    <option>6 months</option>
                                    <option>12 months</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="field column">
                        <label className="label">Gender</label>
                        <div className="control">
                            <div className="select ">
                                <select>
                                    <option>Select gender</option>
                                    <option>With options</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="field column">
                        <label className="label">Gender</label>
                        <div className="control">
                            <div className="select ">
                                <select>
                                    <option>Select gender</option>
                                    <option>With options</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );    
}

export default AddMember;