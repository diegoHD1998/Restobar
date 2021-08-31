import React from 'react';
/* El div que tenga las mesas debe tener la propiedad p-d-flex */
const Mesa = (props) => {
    return (
        <div className="p-d-flex p-my-3 p-ai-center p-jc-center p-shadow-8 CajaMesa" onClick={()=>console.log(props.nombre)}>
            
            <div className='  CajaTexto'>
                <h5 className='p-text-bold TextoMesa'>{props.nombre}</h5>
            </div>

            <div className='circulo '>
                <i className="pi pi-circle-on" style={{color:`#${props.color}`}}></i>
            </div>
        </div>
    );
};

export default Mesa;