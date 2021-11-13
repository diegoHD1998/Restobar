import React,{useContext} from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { useHistory } from 'react-router-dom';
import { AuthContext } from './auth/AuthContext';
import { types } from './types/types';

import './layout/sass/EstilosPropios/login.scss'

const Login = () => {
	
	const {dispatch} = useContext(AuthContext)
	const history = useHistory();



	const handleLogin = () => {

		dispatch({
			type:types.login,
			payload:{
				nombre:'Diego Muñoz'
			}
		})
		history.replace('/')
	}

	return (
		<div className="login-body">
			<div className="login-wrapper">
				<div className="login-panel">
					<button onClick={() => history.push('/')} className="logo p-link">
						<img src="/assets/layout/images/LOGO-SAYKA.svg" alt="freya-layout" />
					</button>

					<InputText className='inputText' id="userName" placeholder="Nombre de Usuario" />
					<Password className='' id="password" placeholder="Contraseña" feedback={false} />
					<Button className='botonLogin' label="LOGIN" type="button" onClick={()=> handleLogin()} ></Button>

				</div>
				<div className="login-footer">
					<h4>Sayka</h4>
					<h6>Copyright Ⓒ Cerveceria Artesanal Sayka</h6>
				</div>
			</div>
		</div >
	)
}

export default Login;



