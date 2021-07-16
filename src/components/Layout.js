import { useTokenStore } from '../state/StateManager';
import Header from "./Header";
import SideBar from "./SideBar";

const Layout = (props) => {

    const jwt = useTokenStore(state => state.jwt);   

    return (
        <div className="app">
            { jwt ? <Header /> : ''}
            <div className="app__content flex">
                { jwt ? <SideBar /> : '' }
                <div className={ jwt ? 'layout' : ''}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default Layout;