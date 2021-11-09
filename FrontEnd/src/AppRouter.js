import React from 'react';
import App from './App';
import Login from './Login'
import Error from './Error'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
const AppRouter = () => {
    return (
        
        <Router>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/home"  component={App} />
                <Route path="/err" exact component={Error} />
            </Switch>
        </Router>
        
    );
};

export default AppRouter;