import React, { useState, useEffect, useContext, useRef } from 'react';
import {useParams,useHistory } from 'react-router-dom'
import { AuthContext } from '../../auth/AuthContext';
import { ColumnGroup } from 'primereact/columngroup';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber'
import { DataTable } from 'primereact/datatable';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Row } from 'primereact/row';

import ProductoService from '../../service/ProductosService/ProductoService';
import CategoriaService from '../../service/ProductosService/CategoriaService';
import OpcionVarienteService from '../../service/ProductosService/OpcionVarianteService';
import OpcionModificadorService from '../../service/ProductosService/OpcionModificadorService';
import ProductoModificadorService from '../../service/ProductosService/ProductoModificadorService';
import ProductoPedidoService from '../../service/PedidoService/ProductoPedidoService';
import PedidoService from '../../service/PedidoService/PedidoService';
import MesaService from '../../service/MesasService/MesaService';
import VentaService from '../../service/VentaService/VentaService';


const PedidosMesa = () => {

    const {id,name,disp,zona} = useParams()

    const {user} = useContext(AuthContext)

    let mesa = {
        idMesa: JSON.parse(id),
        nombre: name ,
        disponibilidad: JSON.parse(disp) ,
        zonaIdZona: JSON.parse(zona)
    }
    
    let emptyPedido = {
        idPedido: null,
        usuarioIdUsuario: user.idUsuario,
        mesaIdMesa: null,
    }

    /* let emptyPedidoPrueba ={
        idPedido: null,
        fecha:null,
        estado:null,
        usuarioIdUsuario: null,
        mesaIdMesa: null,
    } */

    let emptyProductoPedido = {
        idProductoPedido:null,
        cantidad: 1,
        precio: 0,
        nombreReferencia:'',
        modificadorPrecio: 0,
        total: 0,
        fecha: null,
        hora:null,
        productoIdProducto: null,
        pedidoIdPedido: null,
    }

    let emptyProducto = {
        idProducto: null,
        nombre: '',
        descripcion: '',
        precio: null,
        imagen:'',
        estado:'',
        categoriaIdCategoria:null,
        varianteIdVariante:null
    }
    
    

    const history = useHistory();

    const [pedido, setPedido] = useState(null)
    const [productoPedido, setProductoPedido] = useState(emptyProductoPedido)
    const [producto, setProducto] = useState(emptyProducto)
    const [opcionVariante, setOpcionVariante] = useState(null)
    const [opcionModificador, setOpcionModificador] = useState(null)

    const [productos, setProductos] = useState([])
    const [categorias, setCategorias] = useState([])
    const [productoPedidos, setProductoPedidos] = useState([]) // ProductoPedidos de la mesa actual
    const [categoriaSelected, setCategoriaSelected] = useState(null)

    const [opcionVariantes, setOpcionVariantes] = useState(null)
    const [opcionesVariantesProducto, setOpcionesVariantesProducto] = useState(null)
    
    const [productoModificadores, setProductoModificadores] = useState(null)
    const [opcionModificadores, setOpcionModificadores] = useState(null)
    const [opcionesModificadoresProducto, setOpcionesModificadoresProducto] = useState(null)

    const [swit, setSwit] = useState(false) 
    const [textoPropina, setTextoPropina] = useState('')
    
    const [selected, setSelected] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null)
    
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogVisible2, setDialogVisible2] = useState(false);
    const [dialogVisible3, setDialogVisible3] = useState(false);
    const [dialogVisibleVenta, setDialogVisibleVenta] = useState(false);
    const [dialogEfectivo, setDialogEfectivo] = useState(false);
    const [dialogTarjeta, setDialogTarjeta] = useState(false);

    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [SubTotal, setSubTotal] = useState(0)//---------------------------------
    const [Total, setTotal] = useState(0)//---------------------------------
    const [Propina, setPropina] = useState(0)//---------------------------------
    const [efectivoR, setEfectivoR] = useState(0)//---------------------------------
    const [Vuelto, setVuelto] = useState(0)

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    const productoPedidoService = new ProductoPedidoService()
    const pedidoService = new PedidoService()
    const mesaService = new MesaService()
    const ventaService = new VentaService()

    useEffect(() => {

        const categoriaService = new CategoriaService();
        categoriaService.readCategoriasActivas().then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setCategorias(res.data)
                }else{
                    console.log('Error al cargar Datos de Producto')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
        });    
        const productoService = new ProductoService();
        productoService.readProductosActivos().then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setProductos(res.data)
                }else{
                    console.log('Error al cargar Datos de Producto')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
        });
        const pedidoService = new PedidoService()
        const productoPedidoService = new ProductoPedidoService()

        pedidoService.readOne(mesa.idMesa).then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setPedido(res.data)// Busca si la mesa tiene un pedido

                    productoPedidoService.readPPDPedido(res.data.idPedido).then(rest => {
                        if(rest){
                            if(rest.status >= 200 && rest.status < 300){
                                setProductoPedidos(rest.data)// Trae los Productos de ese pedido de la mesa

                            }else{
                                console.log('Error al cargar Datos de ProductoPedido')
                            }
                        }else{
                            console.log('Error de conexion con Backend, Backend esta abajo')
                        }
                    });
                }else{
                    console.log('Esta mesa no tiene un pedido vigente')
                }
            }
        });

        
        const opcionVarianteService = new OpcionVarienteService();
        opcionVarianteService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setOpcionVariantes(res.data)
                }else{
                    console.log('Error al cargar Datos de Producto')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
        });

        const productoModificadorService= new ProductoModificadorService();
        productoModificadorService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setProductoModificadores(res.data)
                }else{
                    console.log('Error al cargar Datos de Producto')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
        });

        const opcionModificadorService = new OpcionModificadorService();
        opcionModificadorService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setOpcionModificadores(res.data)
                }else{
                    console.log('Error al cargar Datos de Producto')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
        });

        
    }, [mesa.idMesa])

    const emptyVenta ={
        idVenta:null,
        /* fecha: null, */
        propina: 0,
        subTotal:0,
        total: 0,
        folioBoleta:'',
        tipoPagoIdTipoPago:null,
        usuarioIdUsuario: pedido?.usuarioIdUsuario,
        pedidoIdPedido: null

        
    }
    
    const buscarProductoModificadores = (idM) => {
        const _productoModificadores = productoModificadores.filter(value => value.productoIdProducto === idM);
        
        if(_productoModificadores.length !== 0 ){
            return(_productoModificadores)
        }else{
            return(null)
        }

    }

    const cambiarSelect = (value) => {
        setSelected(value)
        selectProducto(value)
    }

    const selectProducto = (_producto) => {
        console.log(_producto)
        setProducto(_producto);
        
        let _productoModificadores = buscarProductoModificadores(_producto.idProducto)
        if(_producto.varianteIdVariante !== null){

            let _opcionesV = opcionVariantes.filter(value => value.varianteIdVariante === _producto.varianteIdVariante)
            let _ProductoPedido ={
                ...emptyProductoPedido,
                productoIdProducto: _producto.idProducto,
            }
            setOpcionesVariantesProducto(_opcionesV)
            setProductoPedido(_ProductoPedido);
            setDialogVisible(true);

        }else if(_productoModificadores !== null){
    
            let _opcionesM = [];
            _productoModificadores.forEach((value1) => {
                
                opcionModificadores.forEach((value2) => {

                    if(value1.modificadorIdModificador === value2.modificadorIdModificador)
                    return _opcionesM.push(value2);
                })
            });

            let _ProductoPedido ={
                ...emptyProductoPedido,
                productoIdProducto: _producto.idProducto,
                precio: _producto.precio
            }

            setOpcionesModificadoresProducto(_opcionesM);
            setProductoPedido(_ProductoPedido);
            setDialogVisible2(true);
        }else{

            let _ProductoPedido ={
                ...emptyProductoPedido,
                productoIdProducto: _producto.idProducto,
                precio: _producto.precio
            }
            setProductoPedido(_ProductoPedido)
            setDialogVisible3(true)
        }


    }

    const hideDialog = () => {
        setSubmitted(false);
        setDialogVisible(false);
        setProducto(emptyProducto)
        setProductoPedido(emptyProductoPedido)
        setOpcionesVariantesProducto(null)
        setOpcionVariante(null)
        setSelected(null)
    }

    const hideDialog2 = () => {
        setSubmitted(false);
        setDialogVisible2(false)
        setProducto(emptyProducto)
        setProductoPedido(emptyProductoPedido)
        setOpcionesModificadoresProducto(null)
        setOpcionModificador(null)
        setSelected(null)
    }

    const hideDialog3 = () => {
        setSubmitted(false);
        setDialogVisible3(false)
        setProducto(emptyProducto)
        setProductoPedido(emptyProductoPedido)
        setSelected(null)
    }

    
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
        setProductoPedido(emptyProductoPedido)
    }
    
    const hideDialogVenta = () =>{
        setDialogVisibleVenta(false)
        setEfectivoR(0)
        setTotal(0)
        setTextoPropina('')
        setSwit(false)
    }

    const hideDialogEfectivo = async() => {

        mesa.disponibilidad = false
        let _pedido ={
            ...pedido,
            estado: false
        }
        await mesaService.update(mesa)
        await pedidoService.update(_pedido)
        setDialogEfectivo(false)
        setEfectivoR(0)
        setVuelto(0)
        setTotal(0)
        setTextoPropina('')
        setSwit(false)
        history.push("/")
    }

    const hideDialogTarjeta = async() => {
        setDialogTarjeta(false)
        mesa.disponibilidad = false
        let _pedido ={
            ...pedido,
            estado: false
        }
        await mesaService.update(mesa)
        await pedidoService.update(_pedido)
        setDialogTarjeta(false)
        setEfectivoR(0)
        setTotal(0)
        setTextoPropina('')
        setSwit(false)
        history.push("/")
    }


    const PreCobrar = () => {
        setDialogVisibleVenta(true)
        setTotal(SubTotal)
        setEfectivoR(SubTotal)
    }


    const saveProductoPedido = async() => {
        setSubmitted(true);
        
        if(productoPedido.precio && productoPedido.cantidad){
            let _productoPedidos = [...productoPedidos]
            let _pedido1

            if(pedido === null){
                let _pedido ={
                    ...emptyPedido,
                    mesaIdMesa: mesa.idMesa
                }
                delete _pedido.idPedido
                await pedidoService.create(_pedido).then(res => {
                    if(res){
                        if(res.status >= 200 && res.status<300){
                            setPedido(res.data)
                            _pedido1 = res.data
                            console.log(res.data)
                        }else if(res.status >= 400 && res.status<500){
                            console.log(res)
                            toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                        }else{
                            console.log(res)
                            toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create de Pedido, Status no controlado`, life: 5000 });
                        }
                    }
                });

                mesa.disponibilidad= true
                await mesaService.update(mesa) 
            }
            if(opcionVariante){ //Desarrollo guardar Variante
                console.log('Estas aqui 1')
                
                let _ProductoPedido ={
                    ...productoPedido,
                    nombreReferencia: opcionVariante.nombre,
                    total: productoPedido.precio * productoPedido.cantidad,
                    pedidoIdPedido: pedido ? pedido.idPedido : _pedido1.idPedido
                }

                delete _ProductoPedido.idProductoPedido
                //console.log(_ProductoPedido)
                await productoPedidoService.create(_ProductoPedido).then(res => {
                    if(res){
                        if(res.status >= 200 && res.status<300){

                            _productoPedidos.splice(0,0,res.data)
                            console.log(res.data)

                        }else if(res.status >= 400 && res.status<500){
                            console.log(res)
                            toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                        }else{
                            console.log(res)
                            toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create de ProductoPedido, Status no controlado`, life: 5000 });
                        }
                    }
                })

            }else if(opcionesModificadoresProducto){ //Desarrollo guardar modificador
                if(opcionModificador){

                    console.log('Estas aqui 2')
                    let _ProductoPedido ={
                        ...productoPedido,
                        nombreReferencia: opcionModificador.nombre,
                        total: ((productoPedido.precio + productoPedido.modificadorPrecio) * productoPedido.cantidad),
                        pedidoIdPedido: pedido ? pedido.idPedido : _pedido1.idPedido                
                    }
    
                    delete _ProductoPedido.idProductoPedido
                    //console.log(_ProductoPedido)
                    await productoPedidoService.create(_ProductoPedido).then(res => {
                        if(res){
                            if(res.status >= 200 && res.status<300){
    
                                _productoPedidos.splice(0,0,res.data)
                                console.log(res.data)
    
                            }else if(res.status >= 400 && res.status<500){
                                console.log(res)
                                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                            }else{
                                console.log(res)
                                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create de ProductoPedido, Status no controlado`, life: 5000 });
                            }
                        }
                    })
                }else{
                    console.log('message')
                    return
                }

            }else{
                console.log('Estas aqui 3')
                let _ProductoPedido ={
                    ...productoPedido,
                    total: productoPedido.precio  * productoPedido.cantidad,
                    pedidoIdPedido: pedido ? pedido.idPedido : _pedido1.idPedido                
                }

                delete _ProductoPedido.idProductoPedido
                //console.log(_ProductoPedido)
                await productoPedidoService.create(_ProductoPedido).then(res => {
                    if(res){
                        if(res.status >= 200 && res.status<300){

                            _productoPedidos.splice(0,0,res.data)
                            console.log(res.data)

                        }else if(res.status >= 400 && res.status<500){
                            console.log(res)
                            toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                        }else{
                            console.log(res)
                            toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create de ProductoPedido, Status no controlado`, life: 5000 });
                        }
                    }
                })

            }
            
            
            //Poner aqui todos los SETs finales
            setSubmitted(false)
            setProductoPedidos(_productoPedidos) 
            setDialogVisible(false)
            setDialogVisible2(false)
            setDialogVisible3(false)
            setProducto(emptyProducto)
            setProductoPedido(emptyProductoPedido)
            setOpcionesVariantesProducto(null)
            setOpcionesModificadoresProducto(null)
            setOpcionVariante(null)
            setOpcionModificador(null)
            setSelected(null)

        }


    }

    const saveVenta = async(idTipoPago) => {

        if(idTipoPago === 1){ //Efectivo

            let venta

            if(swit === true){

                venta = {
                    ...emptyVenta,
                    propina: Propina,
                    subTotal: SubTotal,
                    total: Total,
                    tipoPagoIdTipoPago: idTipoPago,
                    pedidoIdPedido: pedido.idPedido
                }
            }else{
                venta = {
                    ...emptyVenta,
                    propina: 0,
                    subTotal: SubTotal,
                    total: Total,
                    tipoPagoIdTipoPago: idTipoPago,
                    pedidoIdPedido: pedido.idPedido
                }
            }


            if(efectivoR >= venta.total){

                delete venta.idVenta
                await ventaService.create(venta).then(res => {
                    if(res.status >=200 && res.status < 300){
                        
                        venta.total === efectivoR ? setVuelto(0) : setVuelto(efectivoR - venta.total) ;
                        setDialogVisibleVenta(false)
                        setDialogEfectivo(true)
                        
    
                    }else{
                        console.log('error en Registrar venta efectivo')
                        console.log(res.data)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'Error en Registrar Venta con Efectivo', life: 5000 });
                    }
                })
            }else{
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'Efectivo Recibido No Suficiente', life: 6000 });
            }



        }else if(idTipoPago === 2){//Tarjeta

            let venta

            if(swit === true){

                venta = {
                    ...emptyVenta,
                    propina: Propina,
                    subTotal: SubTotal,
                    total: Total,
                    tipoPagoIdTipoPago: idTipoPago,
                    pedidoIdPedido: pedido.idPedido
                }
            }else{
                venta = {
                    ...emptyVenta,
                    propina: 0,
                    subTotal: SubTotal,
                    total: Total,
                    tipoPagoIdTipoPago: idTipoPago,
                    pedidoIdPedido: pedido.idPedido
                }
            }
            
            delete venta.idVenta
            await ventaService.create(venta).then(res => {
                if(res.status >=200 && res.status < 300){
                    setDialogVisibleVenta(false)
                    setDialogTarjeta(true)
                }else{
                    console.log('error en Registrar venta efectivo')
                    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: 'Error en Registrar Venta con Tarjeta', life: 5000 });
                }
            })
            

        }

    }

    const confirmDeleteProduct = (product) => {/* <----------------- */
        setProductoPedido(product);
        setDeleteProductDialog(true);
    }
    

    const deleteProduct = async() => { 
        await productoPedidoService.delete(productoPedido.idProductoPedido)
        .then(res => {

            if(res.status >= 200 && res.status < 300){

                setProductoPedidos(productoPedidos.filter(val => val.idProductoPedido !== res.data))
                setDeleteProductDialog(false);
                setProductoPedido(emptyProductoPedido)
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto Eliminado', life: 5000 });

            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete ProductoPedido, Status No controlado`, life: 5000 });
            }
        });
    }

    const SalirDeMesa = async() => {
        if(productoPedidos.length === 0 ){
            mesa.disponibilidad = false
            await mesaService.update(mesa)
        }else{
            mesa.disponibilidad = true
            await mesaService.update(mesa)
        }

        history.push("/")
    }

    const onCategoriaChange = (e) => {
        dt.current.filter(e.value, 'categoriaIdCategoria', 'equals');
        setCategoriaSelected(e.value);
    }

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _productoPedido = {...productoPedido};
        _productoPedido[`${name}`] = val;
        console.log(val)
        setProductoPedido(_productoPedido);
    }

    const onInputNumberChangeV = (value, name, opcionV) => {
        const val = value || 0;
        let _productoPedido = {...productoPedido};
        _productoPedido[`${name}`] = val;
        setProductoPedido(_productoPedido);
        setOpcionVariante(opcionV)
    }

    const onInputNumberChangeM = (value, name, opcionM) => {
        const val = value || 0;
        let _productoPedido = {...productoPedido};
        _productoPedido[`${name}`] = val;
        setProductoPedido(_productoPedido);
        setOpcionModificador(opcionM)
    }

    const onInputSwitchChange = (e) => {
        const val = e.value
        if(val === true){
            setTextoPropina('+ Propina')
            setTotal(Total+Propina)
            setEfectivoR(Total+Propina)
            setSwit(true)
        }else if(val === false){
            setTextoPropina('')
            setTotal(Total-Propina)
            setEfectivoR(Total-Propina)
            setSwit(false)
        }

    }

    const HoraBodyTemplate = (rowData) => {
        let _hora = rowData.hora.hours
        let _minuto = rowData.hora.minutes
        let _tiempo = `${_hora}:${_minuto}`
        return <span className={`product-badge-1 status-activo`}>{_tiempo}</span>
    }

    const PrecioBodyTemplate = (rowData) => {
        return rowData.precio?.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
    }
    
    const TotalBodyTemplate = (rowData) => {
        return rowData.total?.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
    }
    
    const formatCurrency = (value) => {
        return value?.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
    }

    const categoriaItemTemplate = (option) => {
        return <span>{option.nombre}</span>
    }

    const TotalPagoBodyTemplate = () => {
        const _productoPedidoActual = productoPedidos?.filter(value => value.pedidoIdPedido === pedido?.idPedido)
        let total = _productoPedidoActual?.reduce((acc, el) => acc + el.total, 0)
        setSubTotal(total)
        return formatCurrency(total);
    }

    const PropinaTemplate = () => {
        let _propina = SubTotal * 0.1
        setPropina(_propina)
        return `Propina ${formatCurrency(_propina)}`
        
    }

    const productoBodyTemplate = (rowData)=>{
        if(productos){
            const _producto = productos?.find(value => value.idProducto === rowData.productoIdProducto)
            return(
                <>
                    <span>
                        {_producto?.nombre}
                    </span>
                </>
            )
        }
    }
    
    const ProductoTemplate = (rowData) => {
        if(categorias){
            let _categoria = categorias?.find(value => value?.idCategoria === rowData?.categoriaIdCategoria)
            let _variantes = opcionVariantes?.filter(value => value?.varianteIdVariante === rowData.varianteIdVariante)
            let cont = 0
            _variantes?.forEach(element => {
                if(element)
                cont = cont + 1  
            });
            
            return(
                <>
                    <div className="ProductoItem" >
                        <img src={`/assets/layout/images/sayka-favicon-100x100.png`} alt={rowData.nombre} />
                        <div className="detalle-producto">
                            <div className="nombreProducto">{rowData?.nombre}</div>
                            <i style={{color:`#${_categoria?.color}`}} className="pi pi-tag categoriaProductoIcon"></i><span className="categoriaProducto">{_categoria?.nombre}</span>
                        </div>
                        <div className="accion-producto">
                            <span className="precio-producto">{rowData?.precio ? formatCurrency(rowData?.precio) : <span className='variante-producto' >{`${cont} variantes`}</span>}</span>
                        </div>
                    </div>
                </>
            )
        }
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined " onClick={() => confirmDeleteProduct(rowData)}/>
            </div>
        );
    }

    const header4 = (
        
        <div className='p-d-flex p-jc-between'>

            <div className='p-d-flex p-ai-center' >
                <Button icon="pi pi-arrow-left" className="p-button-rounded p-mr-3" onClick={()=>SalirDeMesa()}/>
                <span className='' >{name.toUpperCase()}</span>
            </div>

            <div>
                <Button label='Pre-Cuenta' disabled={pedido === null ? true : false}  className='p-button-info p-mr-2' />
                <Button label='Cobrar' disabled={pedido === null ? true : false}  className='p-button-success' onClick={()=> PreCobrar() } />
            </div>
            
        </div>
        
    );

    const dialogFooter = (
        <>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
            <Button label='Guardar' icon='pi pi-check' className='p-button-text' onClick={saveProductoPedido} />
        </>
    );

    const dialogFooter2 = (
        <>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog2} />
            <Button label='Guardar' icon='pi pi-check' className='p-button-text' onClick={saveProductoPedido} />
        </>
    );

    const dialogFooter3 = (
        <>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog3} />
            <Button label='Guardar' icon='pi pi-check' className='p-button-text' onClick={saveProductoPedido} />
        </>
    );

    

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    
    const header = (
        <div className='p-d-flex p-jc-between' >
            <div>
                <h4><b>Lista de Productos</b></h4>
            </div>

            <div>
                <span className="p-input-icon-left ">
                    <i className="pi pi-search" />
                    <InputText type="search" style={{width:'120px'}} onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
                </span>
                <Dropdown value={categoriaSelected} options={categorias} optionLabel='nombre' optionValue='idCategoria' placeholder='Categoria' itemTemplate={categoriaItemTemplate} onChange={(e)=>onCategoriaChange(e)} className='p-column-filter' showClear />
            </div>
        </div>
    )

    const header1 = (
        <div>
            <span><b> {`${producto.nombre.toUpperCase()} ${opcionVariante ? opcionVariante.nombre : ''}: `}</b> </span>
            <span><b>{`${ productoPedido.precio ? formatCurrency(productoPedido.precio) : ''}`}</b></span>
        </div>
    )
    const header2 = (
        <div>
            <span><b> {`${producto.nombre.toUpperCase()} ${opcionModificador ? opcionModificador.nombre : ''} : ${formatCurrency(productoPedido.precio)}`}</b> </span>
        </div>
    )
    const header3 = (
        <div>
            <span><b> {`${producto.nombre.toUpperCase()}: ${formatCurrency(productoPedido.precio)} `}</b> </span>
            
        </div>
    )

    const Efectivo = (
        <div>
            <i className="pi pi-money-bill" style={{'fontSize': '1.2em'}}></i>
            <span style={{'fontSize': '1.2em'}}> Efectivo</span>
        </div>
    )

    const Tarjeta = (
        <div>
            <i className="pi pi-credit-card" style={{'fontSize': '1.2em'}}></i>
            <span style={{'fontSize': '1.2em'}}> Tarjeta</span>
        </div>
        
    )
    const dialogFooterEfectivo = <div className="p-d-flex p-jc-center"><Button label="Finalizar Venta" className="p-button-text" autoFocus onClick={() => hideDialogEfectivo()} /></div>;
    const dialogFooterTarjeta = <div className="p-d-flex p-jc-center"><Button label="Finalizar Venta" className="p-button-text" autoFocus onClick={() => hideDialogTarjeta()} /></div>;

    let headerGroup = <ColumnGroup>                    
                        <Row>
                            <Column header="Productos"/>
                            <Column header=""/>
                            <Column header="Precio"/>
                            <Column header="Cant"/>
                            <Column header="Total" />
                            <Column/>
                            <Column/>
                        </Row>
                    </ColumnGroup>;

    let footerGroup = <ColumnGroup>
                        <Row>
                            <Column footer="SubTotal:" colSpan={4} footerStyle={{textAlign:'right', color: 'black'}}/>
                            <Column footer={TotalPagoBodyTemplate} footerStyle={{color:'black'}}/>
                            <Column footer={PropinaTemplate} colSpan={2} style={{color:'gray', fontSize:'0.8em'}} />
                        </Row>
                        
                        </ColumnGroup>;

    return (

        <div className='p-grid p-d-flex' >
                <Toast ref={toast} />
            <div className='p-col-12 p-md-6 '>
                <DataTable dataKey="pedidoIdPedido" value={productoPedidos} header={header4} scrollable scrollHeight='240px' headerColumnGroup={headerGroup} footerColumnGroup={footerGroup} /* scrollable scrollHeight='400px' */>
                    <Column field="productoIdProducto" body={productoBodyTemplate} />
                    <Column field="nombreReferencia" />
                    <Column field="precio" body={PrecioBodyTemplate} />
                    <Column field="cantidad" style={{padding:'0px 0px 0px 25px'}} />
                    <Column field="total" body={TotalBodyTemplate}/>
                    <Column body={HoraBodyTemplate} />
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>

            <div className='TablaProductos p-col-12 p-md-6 '>
                <DataTable ref={dt} dataKey='idProducto' value={productos} header={header} scrollable scrollHeight='330px'  
                 selection={selected} onSelectionChange={e => cambiarSelect(e.value)} globalFilter={globalFilter}  selectionMode="single" emptyMessage='No hay Productos Disponibles'>
                    <Column field='nombre' style={{display:'none'}} />
                    <Column field='categoriaIdCategoria' headerStyle={{display:'none'}} body={ProductoTemplate} />
                </DataTable>
            </div>


            <Dialog visible={dialogVisible} style={{width:'600px'}} header={header1} modal className='p-fluid' footer={dialogFooter} onHide={hideDialog} >
                
                <div className= 'p-d-flex p-col-12 p-ai-center' /* style={submitted && !productoPedido.precio ? {border: '1px solid red'}:{}} */ >
                    {
                        opcionesVariantesProducto?.map((value1) => {
                            return(
                                <div key={value1.idOpcionV} className='p-mr-2 p-my-2 '>
                                    <Button className={`p-button-outlined p-button-success BotonPedido `} style={submitted && !productoPedido.precio ? {border: '1px solid red'}:{}} label={value1.nombre} onClick={()=>onInputNumberChangeV(value1.precio, 'precio', value1)}/>
                                </div>
                            )
                        })
                    }
                    <div>
                        {submitted && !productoPedido.precio && <small style={{color:'red'}} >*Seleccione Una Opcion</small>}
                    </div>
                </div>

                <div className="p-field p-col-12">
                    <label htmlFor="horizontal">Cantidad</label>
                    <InputNumber inputId="horizontal" min={1} value={productoPedido.cantidad} onChange={(e) => onInputNumberChange(e, 'cantidad')} showButtons buttonLayout="horizontal" step={1}
                        decrementButtonClassName="p-button-info" incrementButtonClassName="p-button-info" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                </div>

                <div className="p-field p-col-12">
                    <div>
                        <span style={{fontSize:'25px'}} > <b>{`TOTAL: ${formatCurrency(productoPedido.precio * productoPedido.cantidad)}`}</b> </span>
                    </div>
                </div>

            </Dialog>




            <Dialog visible={dialogVisible2} style={{width:'600px'}} header={header2} modal className='p-fluid' footer={dialogFooter2} onHide={hideDialog2} >
                
                <div className= 'p-d-flex p-col-12 p-ai-center'>
                    {
                        opcionesModificadoresProducto?.map((value1) => 
                            <div key={value1.idOpcionM} className='p-mr-2 p-my-2 '>
                                <Button className="p-button-outlined p-button-success" style={submitted && !opcionModificador? {border: '1px solid red'}:{}} label={value1.nombre} onClick={()=>onInputNumberChangeM(value1.precio,'modificadorPrecio',value1)}/>
                            </div>
                        )
                    }
                    <div>
                        {submitted && !opcionModificador && <small style={{color:'red'}} >*Seleccione Una Opcion</small>}
                    </div>
                </div>

                <div className="p-field p-col-12 ">
                    <label htmlFor="horizontal">Cantidad</label>
                    <InputNumber inputId="horizontal" min={1} value={productoPedido.cantidad} onChange={(e) => onInputNumberChange(e, 'cantidad')} showButtons buttonLayout="horizontal" step={1}
                        decrementButtonClassName="p-button-info" incrementButtonClassName="p-button-info" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                </div>

                <div className="p-field p-col-12">
                    <span style={{fontSize:'25px'}} > <b>{`TOTAL: ${formatCurrency(((productoPedido.precio + productoPedido.modificadorPrecio) * productoPedido.cantidad))}`}</b> </span>
                </div>

            </Dialog>




            <Dialog visible={dialogVisible3} style={{width:'400px'}} header={header3} modal className='p-fluid' footer={dialogFooter3} onHide={hideDialog3} >

                <div className="p-field p-col-12">
                    <label htmlFor="horizontal">Cantidad</label>
                    <InputNumber inputId="horizontal" min={1} value={productoPedido.cantidad} onChange={(e) => onInputNumberChange(e, 'cantidad')} showButtons buttonLayout="horizontal" step={1}
                        decrementButtonClassName="p-button-info" incrementButtonClassName="p-button-info" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                </div>

                <div className="p-field p-col-12">
                    <span style={{fontSize:'25px'}} > <b>{`TOTAL: ${formatCurrency(productoPedido.precio * productoPedido.cantidad)}`}</b> </span>
                </div>

            </Dialog>

            
            <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {productoPedido && <span>Estas seguro que quieres eliminar una <b>{productoBodyTemplate(productoPedido)} {productoPedido.nombreReferencia} x{productoPedido.cantidad}</b>?</span>}
                        </div>
            </Dialog>




            <Dialog visible={dialogVisibleVenta} style={{ width: '600px' }} header={name} modal onHide={hideDialogVenta} >
                <div>
                    <div className='p-d-flex p-flex-column  p-ai-center' >
                        <div>
                            <h5 style={{fontSize:'2.5em'}}>
                                <b>{`${formatCurrency(Total)} `}</b>
                            </h5>
                        </div>

                        <div>
                            <h5>
                                <b>Cantidad Total a Pagar {textoPropina}</b>
                            </h5>
                        </div>

                    </div>

                    <Divider/>

                    <div className='p-d-flex p-ai-center p-jc-between' >

                        <div>
                            <h5 style={{margin:'0px'}}>
                                <b>Propina: {formatCurrency(Propina)} </b>
                            </h5>
                        </div>

                        <div>
                            <InputSwitch checked={swit} onChange={(e)=>onInputSwitchChange(e)}/>
                        </div>

                    </div>

                    <Divider/>

                    <div className='p-d-flex p-flex-column p-ai-center'>

                        <div className="p-field">
                            <label htmlFor="efectivo">Efectivo recibido</label>
                            <InputNumber id="efectivo" value={efectivoR} onChange={(e)=> setEfectivoR(e.value)} mode="currency" currency="CLP" locale="es-CL" />
                            
                        </div>

                        <Button label={Efectivo} className='p-button-info p-button-outlined p-m-3 p-col-12' onClick={()=>saveVenta(1)} />
                        <Button label={Tarjeta}  className='p-button-info p-button-outlined p-m-3 p-col-12' onClick={()=>saveVenta(2)} />

                    </div>

                </div>
            </Dialog>

            <Dialog visible={dialogEfectivo}  footer={dialogFooterEfectivo}  showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }} onHide={hideDialogEfectivo} >
                
                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h4>
                        <b>Venta Registrada Exitosamente</b>
                        
                    </h4>
                    <div style={{fontSize:'18px',fontWeight:'bold'}} >
                        <span>Total: {formatCurrency(Total)} </span>
                        <span>Vuelto: {formatCurrency(Vuelto)} </span>
                    </div>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Metodo de Pago Efectivo
                    </p>
                </div>
                
            </Dialog>

            <Dialog visible={dialogTarjeta}  footer={dialogFooterTarjeta} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }} onHide={hideDialogTarjeta} >

                <div className="p-d-flex p-ai-center p-dir-col p-pt-6 p-px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h4>
                        <b>Venta Registrada Exitosamente</b>
                    </h4>
                    <div style={{fontSize:'18px',fontWeight:'bold'}}>
                        <span>Total: {formatCurrency(Total)} </span>
                    </div>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Metodo de Pago Tarjeta
                    </p>
                </div>

            </Dialog>

        </div>
    );
}

export default PedidosMesa