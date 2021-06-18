import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from './pages/Home';
import LogIn from "./pages/LogIn";
import AddMember from "./pages/AddMember";
import Header from './components/Header'
import SideBar from "./components/SideBar";
import NotFound from "./pages/NotFound";
import { Fragment } from "react";
import useStore from './state/jwtState';

function App() {  
  
  const getJwt = useStore(state => state.jwt);   
  console.log('app', getJwt);
  function PrivateRoute({ component: Component, ...rest }) {  
    console.log('component', Component)  
    return (
      <Route
        {...rest}
        render={props =>
          getJwt ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                // state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }

  return (
    <Fragment>
      <Router>
        <div className="app">
          { getJwt ? <Header /> : ''}
          <div className="app__content flex">
            { getJwt ? <SideBar /> : '' }
            <Switch>
              <PrivateRoute path="/" exact component={Home} / >                
              <PrivateRoute path="/addMember" component={AddMember} />              
              <Route path="/login"><LogIn /></Route>
              <Route><NotFound /></Route>
              
              {/* <Redirect to="/404" /> */}
            </Switch>        
          </div>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
