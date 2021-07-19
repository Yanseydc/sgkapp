import { useTokenStore, useUserStore } from '../state/StateManager';
import { useEffect, useState } from "react";
import { useHistory } from "react-router";


const LogIn = () => {
    const addToken = useTokenStore(state => state.addToken); 
    const getJwt = useTokenStore( (state) => state.jwt); 
    const signIn = useUserStore(state => state.signIn);
    const signUp = useUserStore(state => state.signUp);

    let initialSignUpFormState = {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',        
    }
    
    let [signinForm, setSigninForm] = useState({
        username: '',
        password: ''
    });

    let [signupForm, setSignupForm] = useState(initialSignUpFormState);
    
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

    const signingIn = async (e) => { 
        e.preventDefault();    
        let token = await signIn(signinForm)

        localStorage.setItem("jwt", token);
        
        addToken(token);

        history.push('/'); 
    }

    const signingUp = async (e) => {
        e.preventDefault();
        const { username, email, password } = signupForm;
        await signUp({username, email, password});
        setSignupForm({...initialSignUpFormState});
        document.querySelector('.signin-btn').click();
    }

    return (
        <div className="login">
            <div className="login__container">
                <div className="login__container-bgColor">
                    <div className="login__box signin">
                        <h2>Ya tienes una cuenta ?</h2>
                        <button type="button" className="signin-btn">Ingresar</button>
                    </div>
                    <div className="login__box signup">
                        <h2>No tienes una cuenta ?</h2>
                        <button type="button" className="signup-btn">Registrate</button>
                    </div>
                </div>    
                <div className="login__form">
                    <div className="form signinForm">
                        <form id="singinForm" onSubmit={signingIn}>
                            <h3>Iniciar Sesion</h3>
                            <input type="text" name="username" value={signinForm.username} placeholder="Usuario" onChange={handleInputEventSignin} required/>
                            <input type="password" name="password" value={signinForm.password} placeholder="Contraseña" onChange={handleInputEventSignin} required/>
                            <input id="signUpForm" type="submit" value="Ingresar" /> 
                        </form>
                    </div>

                    <div className="form signupForm">
                        <form id="singupForm" onSubmit={signingUp}>
                            <h3>Registrar Usuario</h3>
                            <input type="text" name="username" value={signupForm.username} placeholder="Usuario" onChange={handleInputEventSignup} required/>
                            <input type="email" name="email" value={signupForm.email} placeholder="Correo" onChange={handleInputEventSignup} required/>
                            <input type="password" name="password" value={signupForm.password} placeholder="Contraseña" onChange={handleInputEventSignup} required/>
                            <input type="password" name="confirmPassword" value={signupForm.confirmPassword} placeholder="Confirmar Contraseña" onChange={handleInputEventSignup} required/>
                            <input type="submit" value="Registrar" onChange={handleInputEventSignup}/> 
                        </form>
                        
                    </div>
                </div>            
            </div>
        </div>
    );
};

export default LogIn;