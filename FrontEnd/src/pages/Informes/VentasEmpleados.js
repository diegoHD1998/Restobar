import React from 'react'
import { Chart } from 'primereact/chart';



export default function VentasEmpleados() {

    const basicData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: '#42A5F5',
                data: [65, 59, 80, 81, 56, 55, 40],

            },
            {
                label: 'My Second dataset',
                backgroundColor: '#FFA726',
                data: [28, 48, 40, 19, 86, 27, 90]
            }
        ]
    };

    const horizontalOptions = {
        indexAxis: 'y',
        maintainAspectRatio: false,
        aspectRatio: .8,
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        
    };

    return (
        
        
        <div className='p-col-12 card' >
            <Chart type="bar" data={basicData} options={horizontalOptions}/>
            {/* <Bar data={basicData}/> */}
        </div>

    )
}
