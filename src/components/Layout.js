import { useTokenStore, useAxiosStore } from '../state/StateManager';
import Header from "./Header";
import Loader from './Loader';
import SideBar from "./SideBar";

const Layout = (props) => {

    const jwt = useTokenStore(state => state.jwt); 
    const loading = useAxiosStore(state => state.loading);

    return (
        <div className="app">
            { loading ? <Loader/> : '' }
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