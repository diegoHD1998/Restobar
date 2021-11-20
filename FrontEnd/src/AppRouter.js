import React, {useContext} from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { AuthContext } from './auth/AuthContext';
import Login from './Login'
import App from './App';


const AppRouter = () => {

    const {user} = useContext(AuthContext)

    

    return (
            <Router>
                <Switch>

                    <Route exact path="/Login" component={Login} />

                    <Route path="/" render={()=> (user.logged) ? <App/> : <Redirect to='/Login' /> } />

                </Switch>
            </Router>
    );
};

export default AppRouter;