import React, {useState, useEffect} from 'react';
import {Calendar} from 'primereact/calendar'
import { addLocale } from 'primereact/api';
import { Chart } from 'primereact/chart';
import VentasService from '../../service/InformeService/VentaService';

const ResumenVentas = () => {
    const [date1, setDate1] = useState(null)
    const [date2, setDate2] = useState(null)
    const [Ventas, setVentas] = useState(null)
    const [Fechas, setFechas] = useState(null)

    /* const fechaOptions = {month:'short', day:'numeric'} */

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
        let inicio = new Date()
        let final = new Date()

        inicio.setDate(inicio.getDate()-30)

        setDate1(inicio)
        setDate2(final)

        const ventasService = new VentasService()
        ventasService.getVentasFake().then(data => {

            
            setVentas(data.map(value =>value.montoTotal))
            setFechas(data.map(value =>{
                let _date = new Date(value.fecha)
                let _fecha = _date.toLocaleDateString('es-CL',{month:'short', day:'numeric'})
                return _fecha
            }))
            
        })
        
    },[]);
    


    
    
    /* const Ventas = Ventas.map(value => value.montoTotal)
    const Fecha = Ventas.map(value => value.fecha) */
    
    
    const lineData = {
        labels:Fechas,
        datasets: [
            {
                data: Ventas,
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
        scales:{

            yAxes: [{

                
                ticks: {
                    
                    beginAtZero: true,
                    /* stepSize: 200000, */
                    callback: function(value) {
                        return value.toLocaleString("es-CL",{style:"currency", currency:"CLP"});
                    },
                    
                }
            }],
            


        },
        tooltips:{
            callbacks:{
                label: function(value){
                    /* console.log(value) */
                    return value.yLabel.toLocaleString("es-CL",{style:"currency", currency:"CLP"});
                }
            }
        }
        
    };
    
    return (
        <>

            <div className='p-fluid p-grid ' >

                <div className='p-field'>
                    <label htmlFor="date1">Fecha Inicial: </label>
                    <Calendar id='date1' value={date1} dateFormat='dd M yy' onChange={(e)=>setDate1(e.value)}  showIcon className='p-mr-3' locale='es' />
                </div>

                <div className='p-field'>
                    <label htmlFor="date2"> Fecha Final: </label>
                    <Calendar id='date2' value={date2} dateFormat='dd M yy' onChange={(e)=>setDate2(e.value)} showIcon locale='es'/>
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

/* 
<div className="p-col-12 p-lg-12">
                <div className="card">
                <div>
                <Calendar value={date1} dateFormat='dd-mm-yy' onChange={(e)=>setDate1(e.value)} showIcon/>
                    </div>
                    <Chart type="line" data={lineData} />
                </div>
                </div> */
                

                /* <div className='p-grid p-card p-jc-center'>
            <div className='p-d-flex'>
            <Calendar value={date1} dateFormat='dd-mm-yy' onChange={(e)=>setDate1(e.value)} showIcon/>
            <Calendar value={date2} dateFormat='dd-mm-yy' onChange={(e)=>setDate2(e.value)} showIcon/>
            </div>

            <div className=' p-col-12' style={{width:'65%'}}>
            <Chart type="line" data={lineData}  />
            </div>

            </div> */
            
            
            /* <div className='p-d-flex'>
            <Calendar value={date1} dateFormat='dd-mm-yy' onChange={(e)=>setDate1(e.value)} showIcon/>
            <Calendar value={date2} dateFormat='dd-mm-yy' onChange={(e)=>setDate2(e.value)} showIcon/>
            </div> */







            /* const Ventas = [
                {idVenta:1, fecha:'2021-10-10', montoTotal:360000, Estado:'Activo', propina:1000, folioBoleta:'ofingn', tipoPagoIdTipoPago:1, boletaIdBoleta:1},
                {idVenta:2, fecha:'2021-10-11', montoTotal:540745, Estado:'Activo', propina:0, folioBoleta:'ergerg', tipoPagoIdTipoPago:1, boletaIdBoleta:2},
                {idVenta:3, fecha:'2021-10-12', montoTotal:360000, Estado:'Activo', propina:1000, folioBoleta:'ewtwtr', tipoPagoIdTipoPago:1, boletaIdBoleta:3},
                {idVenta:4, fecha:'2021-10-13', montoTotal:906757, Estado:'Activo', propina:500, folioBoleta:'cvbcvb', tipoPagoIdTipoPago:1, boletaIdBoleta:4},
                {idVenta:5, fecha:'2021-10-14', montoTotal:305463, Estado:'Activo', propina:0, folioBoleta:'hjkhjk', tipoPagoIdTipoPago:1, boletaIdBoleta:5},
                {idVenta:6, fecha:'2021-10-15', montoTotal:670867, Estado:'Activo', propina:2000, folioBoleta:'retere', tipoPagoIdTipoPago:1, boletaIdBoleta:6},
                {idVenta:7, fecha:'2021-10-16', montoTotal:120345, Estado:'Activo', propina:1000, folioBoleta:'kghjad', tipoPagoIdTipoPago:1, boletaIdBoleta:7},
                {idVenta:8, fecha:'2021-10-17', montoTotal:320456, Estado:'Activo', propina:0, folioBoleta:'trhfgs', tipoPagoIdTipoPago:2, boletaIdBoleta:8},
                {idVenta:9, fecha:'2021-10-18', montoTotal:550666, Estado:'Activo', propina:1000, folioBoleta:'ergfda', tipoPagoIdTipoPago:2, boletaIdBoleta:9},
                {idVenta:10, fecha:'2021-10-19', montoTotal:708967, Estado:'Activo', propina:0, folioBoleta:'dfhsdh', tipoPagoIdTipoPago:2, boletaIdBoleta:10},
                {idVenta:11, fecha:'2021-10-20', montoTotal:320523, Estado:'Activo', propina:1000, folioBoleta:'tyjghs', tipoPagoIdTipoPago:2, boletaIdBoleta:11},
                {idVenta:12, fecha:'2021-10-21', montoTotal:250235, Estado:'Activo', propina:0, folioBoleta:'bnbbvf', tipoPagoIdTipoPago:2, boletaIdBoleta:12},
                {idVenta:13, fecha:'2021-10-22', montoTotal:830523, Estado:'Activo', propina:1000, folioBoleta:'uyuyut', tipoPagoIdTipoPago:2, boletaIdBoleta:13},
                {idVenta:14, fecha:'2021-10-23', montoTotal:200000, Estado:'Activo', propina:1000, folioBoleta:'wretrh', tipoPagoIdTipoPago:2, boletaIdBoleta:14},
            ] */