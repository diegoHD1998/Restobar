import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/ProductoPedidos`


export default class ProductoPedidoService {

    async create(productoPedido){
        return await axios.post(baseUrl,productoPedido).then(res => res)
        .catch(err => err.response)
    }
    async delete(idPro,idPe){// falta logica
        return await axios.delete(`${baseUrl}/${idPro}/${idPe}`).then(res => res)
        .catch(err => err.response)
    }

}