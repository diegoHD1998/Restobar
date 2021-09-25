import React, {useState} from 'react';
import { InputSwitch } from 'primereact/inputswitch';

const Switch = ({nombre, bandera, cambiarBandera}) => {

    

    return (
        <div className='p-d-flex p-jc-between p-p-2'>
            
            <div> <span>{nombre}:</span> <span>{`(fjrj,ewgwe,esgf)`}</span> </div> 
            <div> <InputSwitch  checked={bandera} onChange={cambiarBandera} /> </div> 
            
        </div>
    );
};

export default Switch;