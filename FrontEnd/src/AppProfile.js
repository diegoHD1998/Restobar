import React, { useContext, useState } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import { AuthContext } from './auth/AuthContext';
import { types } from './types/types';
import {useHistory} from 'react-router-dom'

export const AppProfile = () => {

    const [expanded, setExpanded] = useState(false);
    const {user:{nombre}, dispatch} = useContext(AuthContext)
    const history = useHistory();

    const onClick = (event) => {
        setExpanded(prevState => !prevState);
        event.preventDefault();
    }

    const handleLogout = () => {
        dispatch({
            type:types.logout
        });
        history.replace('/Login')
    }

    return (
        <div className="layout-profile">
            <div>
                <img src="/assets/layout/images/profile.png" alt="Profile" />
            </div>
            <button className="p-link layout-profile-link" onClick={onClick}>
                <span className="username">{nombre}</span>
                <i className="pi pi-fw pi-cog" />
            </button>
            <CSSTransition classNames="p-toggleable-content" timeout={{ enter: 1000, exit: 450 }} in={expanded} unmountOnExit>
                <ul className={classNames({ 'layout-profile-expanded': expanded })}>
                    {/* <li><button type="button" className="p-link"><i className="pi pi-fw pi-user" /><span>Account</span></button></li>
                    <li><button type="button" className="p-link"><i className="pi pi-fw pi-inbox" /><span>Notifications</span><span className="menuitem-badge">2</span></button></li> */}
                    <li><button type="button" className="p-link" onClick={()=>handleLogout()}><i className="pi pi-fw pi-sign-out" /><span>Logout</span></button></li>
                </ul>
            </CSSTransition>
        </div>
    );

}
