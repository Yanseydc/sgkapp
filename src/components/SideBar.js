import { useEffect } from "react";
import { useHistory } from 'react-router-dom';


const SideBar = () => {
    const history = useHistory();


    useEffect(() => {
        console.log('side bar')
    },[])

    return (
        <div className="sidebar hide-for-mobile">
            <div className="sidebar__menu">
                <ul>
                    <li>
                        <a href="#1" onClick={() => history.push('/addMember')}>Registrar nuevo cliente</a>
                    </li>
                    <li>
                        <a href="#2">Registrar nuevo cliente</a>
                    </li>
                    <li>
                        <a href="#3">Registrar nuevo cliente</a>
                    </li>
                </ul>
            </div>
        </div>
    );

}

export default SideBar;