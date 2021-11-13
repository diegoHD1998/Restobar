import React, { useContext } from 'react';
import {useHistory} from 'react-router-dom'
import { AuthContext } from './auth/AuthContext';
import { types } from './types/types';

export const AppTopbar = (props) => {

    const {dispatch} = useContext(AuthContext)
    const history = useHistory()

    const handleLogout = () => {
        dispatch({
            type:types.logout
        });
        history.replace('/Login')
    }
    
    return (
        <div className="layout-topbar clearfix">
            <button type="button" className="p-link layout-menu-button" onClick={props.onToggleMenu}>
                <span className="pi pi-bars" />
            </button>
            <div className="layout-topbar-icons">
                <button type="button" className="p-link" onClick={()=>handleLogout()}>
                    <span className="layout-topbar-item-text">User</span>
                    <span className="layout-topbar-icon pi pi-sign-out" />
                </button>
            </div>
        </div>
    );
}
