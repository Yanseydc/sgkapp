import { useEffect } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {

    useEffect(() => {
        // console.log('side bar')
    },[])

    return (
        <div className="sidebar hide-for-mobile">
            <div className="sidebar__menu">
                <ul>
                    <li>
                        <Link to="/addClient">
                            Registrar nuevo cliente                    
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );

}

export default SideBar;