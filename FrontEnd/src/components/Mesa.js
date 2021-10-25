import React from 'react';
/* El div que tenga las mesas debe tener la propiedad p-d-flex */
const Mesa = ({nombre, disponibilidad}) => {

    const Disponible = '#AAAAAA'
    const Ocupado = '#FF0000'

    return (
        <div className="p-d-flex p-my-3 p-ai-center p-jc-center p-shadow-8 CajaMesa" onClick={()=>console.log(nombre)}>
            <div className='  CajaTexto'>
                <h5 className='p-text-bold TextoMesa'>{nombre.toUpperCase()}</h5>
            </div>

            <div className='circulo '>
                <i className="pi pi-circle-on" style={!disponibilidad ? {color:Disponible} : {color:Ocupado}}></i>
            </div>
        </div>
    );
};

export default Mesa;