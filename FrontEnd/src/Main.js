import React from 'react';
import App from './App';
import Login from './Login'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
const Main = () => {
    return (
        <div>
            <BrowserRouter>
            <Switch>
                <Route path='/' exact component={Login} />
                <Route path="/home"  component={App} />
                
            </Switch>
        </BrowserRouter>
        </div>
    );
};

export default Main;