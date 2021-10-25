import React, {useState,useEffect, useRef} from 'react';
import Mesa from '../../components/Mesa'
import Loading from '../../components/Loading'
import MesaService from '../../service/MesasService/MesaService'
import { Toast } from 'primereact/toast';

const SalaDeVentas = () => {
    const toast = useRef(null);

    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error , setError] = useState(false)

    useEffect(()=>{
        const mesaService = new MesaService();
        mesaService.readAll().then((res) => {
            console.log(res)

            if(res){
                if(res.status >= 200 && res.status<300){
                    setMesas(res.data);
                    setLoading(false);
                }else{
                    console.log('Error al cargar Datos de Mesas');
                }
            }else{

                toast.current.show({ severity: 'error', summary: 'Backend No Operativo', detail: `El servidor no responde a las peticiones solicitadas `, life: 20000 });
                console.log('Error de conexion con Backend, Backend esta abajo ')
                setLoading(false)
                setError(true)

            }

            
            
        })

    },[]);

    if(loading === true){
        return(
            <div className='p-grid p-d-flex p-jc-center p-ai-center' style ={{height: '65vh'}} >
                <Toast ref={toast} />
                <Loading/>
            </div>
        )

    }else if(error === true){

        return (
            <div className='p-grid p-d-flex p-mx-auto'>
                <Toast ref={toast} />
                <div className='p-d-flex p-jc-center p-ai-center'> 
                    <div className='p-d-flex'>
                        <h1>Mesas No Disponibles</h1>
                    </div>
                </div>

            </div>
        );
        
    }else{
        return (
            <div className='p-grid p-d-flex p-mx-auto'>
                <Toast ref={toast} />
                {mesas.map(mesa =>
                    <div key={mesa.idMesa} className='p-col-4 p-lg-2 p-md-3 p-sm-4 p-d-flex p-jc-center'> 
                        <Mesa nombre={mesa.nombre} disponibilidad={mesa.disponibilidad} />
                    </div>
                )}
                
            </div>
        );
    }
    
};

export default SalaDeVentas;