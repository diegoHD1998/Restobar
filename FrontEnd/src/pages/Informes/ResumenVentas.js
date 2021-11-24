import React, {useState, useEffect} from 'react';
import {Calendar} from 'primereact/calendar'
import { addLocale } from 'primereact/api';
import { Chart } from 'primereact/chart';
import StoredProcedureVentas from '../../service/InformeService/StoredProcedureVentas'


const ResumenVentas = () => {
    let fecha = new Date();
    let fecha1 = new Date();
    fecha.setDate(fecha.getDate()-30)

    const emptyFecha = {
        date1:fecha,
        date2:fecha1
    }

    const [RangoFecha, setRangoFecha] = useState(emptyFecha)
    const [SubTotalVentas, setSubTotalVentas] = useState([])
    
    /* const fechaOptions = {month:'short', day:'numeric'} */
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
            date1:fecha /* `${fecha.getFullYear()}-${fecha.getMonth()+1}-${fecha.getDate()}` */,
            date2:fecha1 /* `${fecha1.getFullYear()}-${fecha1.getMonth()+1}-${fecha1.getDate()}` */
        }
        console.log(fechas)
        setRangoFecha(fechas)
        
        const storedProcedureVentas = new StoredProcedureVentas()
        storedProcedureVentas.GetVentasSubTotales(fechas).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    console.log(res.data)
                    setSubTotalVentas(res.data)
                }else{
                    console.log(res.data)
                    console.log('Error de status No controlado')
                }
            }else{
                console.log('Backend Abajo')
            }
        })
        
    },[]);
    
    const lineData = {
        labels: SubTotalVentas.map((value) => {
            let _date = new Date(value.fecha)
            return _date.toLocaleDateString('es-CL',{month:'short', day:'numeric'})
        }),
        datasets: [
            {
                data: SubTotalVentas.map((value) => value.subTotal),
                fill: true,
                backgroundColor: 'rgba(66,165,245,0.2)',
                borderColor: '#42A5F5',
                tension: .1,
                pointBackgroundColor:'#42A5F5',
                pointHoverRadius: 6,
                pointHitRadius: 30,
                
            }
        ]
    };
    
    const options = {
        responsive: true,
        title: {
            
          display: true,
          text: 'Resumen de Ventas',
          fontSize: 16
        },
        legend: {
            display:false
        },
        parsing: {
            xAxisKey: 'fecha',
            yAxisKey: 'subTotal'
        },
        scales:{

            
            
            yAxes: [{

                
                ticks: {
                    
                    beginAtZero: true,
                    // stepSize: 200000, 
                    callback: function(value) {
                        return value.toLocaleString("es-CL",{style:"currency", currency:"CLP"});
                    },
                    
                }
            }],
            
            
            
        },
        tooltips:{
            callbacks:{
                label: function(value){
                    
                    return value.yLabel.toLocaleString("es-CL",{style:"currency", currency:"CLP"});
                }
            }
        }
        
        
    };
    

    const onInputChange = async(e, name) => {/* <----------------- */
        
        const val = (e.target && e.target.value) || '';
        let _rangoFecha = {...RangoFecha};
        _rangoFecha[`${name}`] = val;
        setRangoFecha(_rangoFecha)
        
        await storedProcedureVentas.GetVentasSubTotales(_rangoFecha).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    console.log(res.data)
                    setSubTotalVentas(res.data)
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
                    <label htmlFor="date1">Desde: </label>
                    <Calendar id='date1' value={RangoFecha.date1} dateFormat='dd M yy' onChange={(e)=>onInputChange(e,'date1')}  showIcon className='p-mr-3' locale='es' />
                </div>

                <div className='p-field'>
                    <label htmlFor="date2"> Hasta: </label>
                    <Calendar id='date2' value={RangoFecha.date2} dateFormat='dd M yy' onChange={(e)=>onInputChange(e,'date2')} showIcon locale='es'/>
                </div>

            </div> 

            <div className='p-grid p-card p-jc-center' >

                <div className='p-col-10  ' >
                    <Chart type="line" data={lineData} options={options}/>
                </div>

            </div>
        </>
    );
};

export default ResumenVentas;


/* const ventasFakeService = new VentasFakeService()
ventasFakeService.getVentasFake().then(data => {

    
    setVentas(data.map(value =>value.montoTotal))
    setFechas(data.map(value =>{
        let _date = new Date(value.fecha)
        let _fecha = _date.toLocaleDateString('es-CL',{month:'short', day:'numeric'})
        return _fecha
    }))
    
}) */