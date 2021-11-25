import React, {useState, useEffect} from 'react';
import {Calendar} from 'primereact/calendar'
import { addLocale } from 'primereact/api';
import StoredProcedureVentas from '../../service/InformeService/StoredProcedureVentas'
import { 
    Chart as ChartJS, 
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend 
} from "chart.js";

  import { Bar } from "react-chartjs-2";

  ChartJS.register(
    CategoryScale, 
    LinearScale, 
    BarElement, 
    Title, 
    Tooltip, 
    Legend
);

const VentasProductos = () => {

    let fecha = new Date();
    let fecha1 = new Date();
    fecha.setDate(fecha.getDate()-30)

    const emptyFecha = {
        date1:fecha,
        date2:fecha1
    }

    const [RangoFecha, setRangoFecha] = useState(emptyFecha)
    const [VentasProducto, setVentasProducto] = useState([])
    const storedProcedureVentas = new StoredProcedureVentas()

    addLocale('es', {
        firstDayOfWeek: 1,
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
        monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Claro'
    });
    

    useEffect(()=>{
        let fechas = {
            date1:`${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}`,
            date2:`${fecha1.getFullYear()}-${fecha1.getMonth()+1}-${fecha1.getDate()}` 
        }
        console.log(fechas)
        
        const storedProcedureVentas = new StoredProcedureVentas()
        storedProcedureVentas.GetVentasProducto(fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    
                    let _data = res.data.map((value) => {
                        return {
                            x: value.total,
                            y: value.nombre
                        }
                    })
                    setVentasProducto(_data)
                    
                    
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        })
        
    },[]);
    
    const basicData = {
        /* labels: VentasProducto.map(value => value.nombre), */
        datasets: [{
            label: "Ventas",
            data: VentasProducto,
            fill: true,
            borderColor: '#42A5F5',
            backgroundColor: 'rgba(66,165,245,0.2)',
            tension: .1,
            pointBackgroundColor:'#42A5F5',
            pointHoverRadius: 6,
            pointHitRadius: 30,        
        }
        ]
    };
    
    const options = {
        maintainAspectRatio:false,
        responsive: true,
        indexAxis: "y",
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        plugins: {
            legend: {
                position: "top",
            },
            title: {
                display: true,
                text: "Ventas por Producto",
            },
            legend: {
                display:false
            },
             tooltip:{
                callbacks:{
                    /* label: function(value){
                        let valor = value.raw.toLocaleString("es-CL",{style:"currency", currency:"CLP"})
                        let texto = `${value.dataset.label}: ${valor}`
                        return texto ;
                    } */

                    /* footer: function(value){
                        console.log(value)
                        let cant = VentasProducto.forEach(element => element.nombre ===  value.label ? value.cantidad : '-');
                        return `Cantidad: ${cant} `
                    } */
                }
            } 
        },
        
    };
    

    const onInputChange = async(e, name) => {
        
        const val = (e.target && e.target.value) || '';
        let _rangoFecha = {...RangoFecha};
        _rangoFecha[`${name}`] = val;
        setRangoFecha(_rangoFecha)
        
        await storedProcedureVentas.GetVentasProducto(_rangoFecha).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    
                    let _data = res.data.map((value) => {
                        return {
                            x: value.total,
                            y: value.nombre
                        }
                    })
                    setVentasProducto(_data)
                    
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        })
        
    }
    
    return (
        <>

            <div className='p-fluid p-grid ' >

                <div className='p-field'>
                    {/* <label htmlFor="date1">Desde: </label> */}
                    <Calendar id='date1' value={RangoFecha.date1} dateFormat='dd MM yy' onChange={(e)=>onInputChange(e,'date1')}  showIcon className='p-mr-3' locale='es' />
                </div>

                <div className='p-field'>
                    {/* <label htmlFor="date2"> Hasta: </label> */}
                    <Calendar id='date2' value={RangoFecha.date2} dateFormat='dd MM yy' onChange={(e)=>onInputChange(e,'date2')} showIcon locale='es'/>
                </div>

            </div> 

            <div className='p-grid p-card p-jc-center' >

                <div className='p-col-12  ' >
                    <Bar data={basicData} options={options} height={400}/>
                </div>

            </div>
        </>
    );
};

export default VentasProductos;

