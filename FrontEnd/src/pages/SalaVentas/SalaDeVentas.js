import React, {useState,useEffect} from 'react';
import Mesa from '../../components/Mesa'
import Loading from '../../components/Loading'
import MesaService from '../../service/MesasService/MesaService'


const SalaDeVentas = () => {

    const [mesas, setMesas] = useState([]);
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const mesaService = new MesaService();
        mesaService.readAll().then((res) => {
            if(res.status >= 200 && res.status<300){
                setMesas(res.data);
                setLoading(false);
            }else{
                console.log('Error al cargar Datos de Mesas');
            }
            
        })

    },[]);

    if(loading === true){
        return(
            <div className='p-grid p-d-flex p-jc-center p-ai-center' style ={{height: '65vh'}} >
                <Loading/>
            </div>
        )

    }else{

        return (
            <div className='p-grid p-d-flex p-mx-auto'>
    
                {mesas.map(mesa =>
                    <div className='p-col-4 p-lg-2 p-md-3 p-sm-4 p-d-flex p-jc-center'> 
                        <Mesa nombre = {mesa.nombre} color ={mesa.color} />
                    </div>
                )}
                
            </div>
        );
    }
    
};

export default SalaDeVentas;