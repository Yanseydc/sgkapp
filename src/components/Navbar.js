import { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import { useTokenStore, useUserStore } from '../state/StateManager';
import { Link } from "react-router-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(fas, fab);

function NavBar() {
    const history = useHistory();
    const removeToken = useTokenStore(state => state.removeToken); 
    const user = useUserStore( state => state.user);

    const [hamburguerFlag, setHamburguerFlag] = useState(false);
    const hambuguerRef = useRef(null);
    hambuguerRef.current = hamburguerFlag;

    useEffect(() => {
        const hamburguer = document.querySelector('#hamburguer');
        const userDropdown = document.querySelector('#user-dropdown');        

        hamburguer.addEventListener("click", toggle);
        userDropdown.addEventListener('click', userDropDownToggle);        
    },[])

    const toggle = () => {
        setHamburguerFlag(!hambuguerRef.current);
        let fadeElements = document.querySelectorAll('.has-fade');
        let body = document.querySelector('body');
        
        if(hambuguerRef.current) {//open          
            body.classList.add('noscroll');  
            fadeElements.forEach(elem => {
                elem.classList.add('fade-in');
                elem.classList.remove('fade-out');
            });
        } else {//close
            body.classList.remove('noscroll');
            fadeElements.forEach(elem => {
                elem.classList.add('fade-out');
                elem.classList.remove('fade-in');;
            });            
        }
    }

    const userDropDownToggle = () => {
        const dropdown = document.querySelector('.dropdown');
        dropdown.classList.toggle('active');
    };

    const logOut = () => {
        removeToken();
        history.push('/login');
    }

    return(
        <header className={`header ${hamburguerFlag ? 'open': ''}`}>
            <div className="overlay has-fade"></div>
            <nav className="container flex flex-jc-sb flex-ai-c">
                <Link to="/" className="header__logo">
                    {`<SGK />`}                
                </Link>

                <a id="hamburguer" href="#!" className="header__hamburguer  hide-for-desktop">
                    <span></span>
                    <span></span>
                    <span></span>
                </a>

                {/* <div className="header__links hide-for-mobile">
                    <a href="#!">Users</a>
                    <a href="#!">Dashboard</a>
                </div> */}

                {/* <a href="#!" className="button header__cta hide-for-mobile">Log out</a> */}
                <div className="header__user">                    
                    <a href="#!" id="user-dropdown">
                        <span className="username">{user.username}</span>
                        <FontAwesomeIcon icon="user" className="icon" />
                    </a>

                    <div className="dropdown">
                        <h3>{user.username}</h3>
                        <h4>{user.email}</h4>
                        <ul>
                            <li>
                                <i className="fas fa-cog"></i>
                                <a href="#!">Settings</a>
                            </li>
                            <li>
                                <i className="fas fa-sign-out-alt"></i>
                                <a href="#!" onClick={logOut}>Log out</a>
                            </li>
                        </ul>
                    </div>
                </div>

            </nav>

            <div className="header__menu has-fade">
                <Link to="/addClient">
                    <i className="fas fa-user-plus"></i>
                    nuevo cliente                    
                </Link>
            </div>

        </header>
    );
}

export default NavBar;