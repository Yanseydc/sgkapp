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
                            <i className="fas fa-user-plus"></i>
                            nuevo cliente                    
                        </Link>
                    </li>
                    
                </ul>
            </div>
        </div>
    );

}

export default SideBar;