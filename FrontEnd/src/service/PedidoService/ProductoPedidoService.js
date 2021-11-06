import axios from 'axios'

const baseUrl = `${process.env.REACT_APP_URL_BASE}/ProductoPedidos`

export default class ProductoPedidoService {

    async readAll(){
        return await axios.get(baseUrl).then(res => res)
        .catch(err => err.response)
    }

    async readPPDPedido(id){
        return await axios.get(`${baseUrl}/DePedido/${id}`).then(res => res)
        .catch(err => err.response)
    }

    async create(productoPedido){
        return await axios.post(baseUrl,productoPedido).then(res => res)
        .catch(err => err.response)
    }
    async delete(id){// falta logica
        return await axios.delete(`${baseUrl}/${id}`).then(res => res)
        .catch(err => err.response)
    }

}