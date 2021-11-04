import axios from 'axios';

/* const baseUrl = `${process.env.REACT_APP_URL_BASE}/Ventas` */

export default class VentasService {

    async getVentasFake() {
        return await axios.get('/assets/demo/data/ventas.json').then(res => res.data.data)
        .catch(err => err.response)
    }

    
}