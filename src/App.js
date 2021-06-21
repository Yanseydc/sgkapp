import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from './pages/Home';
import LogIn from "./pages/LogIn";
import AddClient from "./pages/AddClient";
import NotFound from "./pages/NotFound";
import { Fragment } from "react";
import { useTokenStore } from './state/jwtState';
import Layout from "./components/Layout";

function App() {  

  const jwt = useTokenStore(state => state.jwt);   
  
  function PrivateRoute({ component: Component, ...rest }) {      
    return (
      <Route
        {...rest}
        render={props =>
          jwt ? (
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
        <Layout>        
            <Switch>
              <PrivateRoute path="/" exact component={Home} / >                
              <PrivateRoute path="/addClient" component={AddClient} />              
              <Route path="/login"><LogIn /></Route>
              <Route><NotFound /></Route>
            </Switch>                  
        </Layout>
      </Router>
    </Fragment>
  );
}

export default App;
