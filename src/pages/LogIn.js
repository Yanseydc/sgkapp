import axios from "axios";
import { useTokenStore } from '../state/StateManager';
import { useEffect, useState } from "react";
import { useHistory } from "react-router";


const LogIn = () => {
    const addToken = useTokenStore(state => state.addToken); 
    const getJwt = useTokenStore( (state) => state.jwt); 
    
    let [signinForm, setSigninForm] = useState({
        username: '',
        password: ''
    });

    let [signupForm, setSignupForm] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',        
    });

    let [signInError, setSigninError] = useState({
        message: '',
        hasError: false
    });
    
    const history = useHistory();
    
    useEffect(() => {            
        if(getJwt) {            
            history.push("/")
        } else {
            const signUpBtn = document.querySelector('.signup-btn');
            const signInBtn = document.querySelector('.signin-btn');
            const form = document.querySelector('.login__form');
            const login = document.querySelector('.login');

            signUpBtn.addEventListener('click', function() {
                form.classList.add('active');
                login.classList.add('active');
            });

            signInBtn.addEventListener('click', function() {
                form.classList.remove('active');
                login.classList.remove('active');
            });
        }
    });

    const handleInputEventSignin = (e) => {
        setSigninError({...signInError, hasError: false});
        setSigninForm({
            ...signinForm,
            [e.target.name]: e.target.value
        });        
    }

    const handleInputEventSignup = (e) => {
        setSignupForm({
            ...signupForm,
            [e.target.name]: e.target.value
        });
    }

    const signIn = async () => {
        try {
            const { username, password } = signinForm;
            const response = await axios.post("http://localhost:4000/api/auth/signin", {username, password});
            const { token } = response.data;
            
            localStorage.setItem("jwt", token);
            
            addToken(token);

            history.push('/');            

        } catch(error) {
            let message;
            if(error.response) {
                message = error.response.data.message ;                
            } else {
                message = 'El servidor esta apagado'                
            }

            setSigninError({
                ...signInError,
                message,
                hasError: true
            });            
        }
    }

    const signUp = async () => {
        try {            
            const { username, email, password } = signupForm;
            await axios.post("http://localhost:4000/api/auth/signin", {
                username, email, password
            });
        } catch(error)  {
            console.log('singup error', error);
        }
    }

    const handleKeyDown = (e) => {        
        if(e.keyCode === 13) {
            const keys = Object.keys(signinForm); //get keys
            //loop through object to validate values
            for(let i in keys) {                
                if(signinForm[keys[i]] === '') {
                    setSigninError({...signInError, hasError: true, message: "Los campos no pueden ir vacios"})
                    return;
                }
            }
            //if everythin is ok, try signin
            signIn();
        }
    }

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__container-bgColor">
                    <div className="login__box signin">
                        <h2>Ya tienes una cuenta ?</h2>
                        <button className="signin-btn">Ingresar</button>
                    </div>
                    <div className="login__box signup">
                        <h2>No tienes una cuenta ?</h2>
                        <button className="signup-btn">Registrate</button>
                    </div>
                </div>    
                <div className="login__form">
                    <div className="form signinForm">
                        <form>
                            <h3>Iniciar Sesion</h3>
                            <input type="text" name="username" value={signinForm.username} placeholder="Usuario" onChange={handleInputEventSignin} onKeyDown={handleKeyDown}/>
                            <input type="password" name="password" value={signinForm.password} placeholder="Contraseña" onChange={handleInputEventSignin} onKeyDown={handleKeyDown}/>
                            <input type="button" onClick={signIn} value="Ingresar" /> 

                            { signInError.hasError ? <span>{signInError.message}</span> : '' }
                        </form>
                    </div>

                    <div className="form signupForm">
                        <form>
                            <h3>Registrar Usuario</h3>
                            <input type="text" name="username" value={signupForm.username} placeholder="Usuario" onChange={handleInputEventSignup}/>
                            <input type="email" name="email" value={signupForm.email} placeholder="Correo" onChange={handleInputEventSignup}/>
                            <input type="password" name="password" value={signupForm.password} placeholder="Contraseña" onChange={handleInputEventSignup}/>
                            <input type="password" name="confirmPassword" value={signupForm.confirmPassword} placeholder="Confirmar Contraseña" onChange={handleInputEventSignup}/>
                            <input type="button" onClick={signUp} value="Registrar" onChange={handleInputEventSignup}/> 
                        </form>
                        
                    </div>
                </div>            
            </div>
        </div>
    );
};

export default LogIn;