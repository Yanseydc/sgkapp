import { Fragment } from "react";
import { useTokenStore } from './../state/jwtState';
import Header from "./Header";
import SideBar from "./SideBar";

const Layout = (props) => {

    const jwt = useTokenStore(state => state.jwt);   

    return (
        <Fragment>
            { jwt ? <Header /> : ''}
            <div className="app__content flex">
                { jwt ? <SideBar /> : '' }
                {props.children}
            </div>
        </Fragment>
    );
}

export default Layout;