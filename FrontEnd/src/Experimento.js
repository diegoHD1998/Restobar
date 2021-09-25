import React, { useState, useEffect } from 'react';
import { InputSwitch } from 'primereact/inputswitch';
import Switch from './components/Switch';
import ModificadorService from './service/ProductosService/ModificadorService';
import OpcionModificadorService from './service/ProductosService/OpcionModificadorService'

const Experimento = () => {

    const [modificadores, setModificadores] = useState([]);
    const [opcionesM, setOpcionesM] = useState([])
    

    useEffect(() => {
        
        const modificadorService = new ModificadorService();
        modificadorService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){

                    const _data = res.data.map(value => {
                        return {
                            ...value,
                            seleccionado:false,

                        }
                    });

                    setModificadores(_data)
                    console.log(res.data)
                }else{
                    console.log('Error ')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo -1')
            }
        });

        const opcionModificadorService = new OpcionModificadorService();
        opcionModificadorService.readAll().then((res) => {
            if(res){
                if(res.status >= 200 && res.status<300){
                    setOpcionesM(res.data)
                }else{
                    console.log('Error ')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo -1')
            }
        })

    }, []);






    const onChangeSwitch = (mod) => {
        const data = modificadores.map(value => {
            if(value.idModificador === mod.idModificador){
                return {
                    ...value,
                    seleccionado:!value.seleccionado
                }
            }else{
                return {
                    ...value
                }

            }


        })

        setModificadores(data)
    }

    const guardar = ()=> {
        const data = modificadores.filter((value) => value.seleccionado === true)
        console.log(data)
    }

    return (
        <div className='p-grid p-d-flex p-flex-column ' >
            {
                modificadores.map(mod => 

                    <div className='p-d-flex p-jc-between p-p-2'>
            
                    <div> <span>{mod.nombre}:</span> <span>{`(fjrj,ewgwe,esgf)`}</span> </div> 
                    <div> <InputSwitch  checked={mod.seleccionado} onChange={()=> onChangeSwitch(mod)} /> </div> 
            
                    </div>
                    
                    
                )

                
            }

            <button onClick={guardar}>Hola</button>
            
        </div>
    );
};

export default Experimento;