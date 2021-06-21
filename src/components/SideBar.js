import { useEffect } from "react";
import { useHistory } from 'react-router-dom';


const SideBar = () => {
    const history = useHistory();


    useEffect(() => {
        // console.log('side bar')
    },[])

    return (
        <div className="sidebar hide-for-mobile">
            <div className="sidebar__menu">
                <ul>
                    <li onClick={() => history.push('/addClient')}>
                        <a role="button" aria-hidden="true" href="/addClient">Registrar nuevo cliente</a>
                    </li>         
                </ul>
            </div>
        </div>
    );

}

export default SideBar;