import React from 'react';
import App from './App';
import Login from './Login'
import Error from './Error'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
const Main = () => {
    return (
        <div>
            <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/home"  component={App} />
                <Route path="/err" exact component={Error} />
            </Switch>
        </BrowserRouter>
        </div>
    );
};

export default Main;