
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import {InputNumber} from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Row } from 'primereact/row';
import { Toast } from 'primereact/toast';

import ProductoService from '../service/ProductosService/ProductoService';
import CategoriaService from '../service/ProductosService/CategoriaService';
import OpcionVarienteService from '../service/ProductosService/OpcionVarianteService';
import OpcionModificadorService from '../service/ProductosService/OpcionModificadorService';
import ProductoModificadorService from '../service/ProductosService/ProductoModificadorService';
import ProductoPedidoService from '../service/PedidoService/ProductoPedidoService';


const DataTableColGroupDemo = () => {


    let empty = {
        productoIdProducto: null,
        pedidoIdPedido: null,
        idProductoPedido:null,
        nombre:'',
        cantidad: 1,
        precio: 0,
        nombreReferencia:'',
        modificadorPrecio: 0,
        total: 0,
        fecha:null,
        hora: null,
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
    const _productoPedidos = [
        {productoIdProducto: 4, pedidoIdPedido:501, nombre:'', cantidad: 1, precio: 6000, nombreReferencia:'', modificadorPrecio: null, total:6000, fecha:null, hora:null},
        {productoIdProducto: 5, pedidoIdPedido:501, nombre:'', cantidad: 2, precio: 10000, nombreReferencia:'', modificadorPrecio: null, total:20000, fecha:null, hora:null},
        {productoIdProducto: 6, pedidoIdPedido:501, nombre:'', cantidad: 1, precio: 6000, nombreReferencia:'', modificadorPrecio: null, total:6000, fecha:null, hora:null},
        {productoIdProducto: 7, pedidoIdPedido:501, nombre:'', cantidad: 3, precio: 500, nombreReferencia:'', modificadorPrecio: null, total:1500, fecha:null, hora:null},
    ];

    const [productoPedido, setProductoPedido] = useState(empty)
    const [producto, setProducto] = useState(emptyProducto)
    const [opcionVariante, setOpcionVariante] = useState(null)
    const [opcionModificador, setOpcionModificador] = useState(null)

    const [productos, setProductos] = useState(null)
    const [categorias, setCategorias] = useState(null)
    const [productoPedidos, setProductoPedidos] = useState(null)

    const [categoriaSelected, setCategoriaSelected] = useState(null)


    
    const [opcionVariantes, setOpcionVariantes] = useState(null)
    const [opcionesVariantesProducto, setOpcionesVariantesProducto] = useState(null)
    
    const [productoModificadores, setProductoModificadores] = useState(null)
    
    const [opcionModificadores, setOpcionModificadores] = useState(null)
    const [opcionesModificadoresProducto, setOpcionesModificadoresProducto] = useState(null)
    
    const [selected, setSelected] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    
    const pedido = {idPedido:1, fecha:'04-10-2021', estado: 'Activo', usuarioIdUsuario:1, mesaIdMesa:2}

    
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogVisible2, setDialogVisible2] = useState(false);
    const [dialogVisible3, setDialogVisible3] = useState(false);

    const [submitted, setSubmitted] = useState(false);

    const productoPedidoService = new ProductoPedidoService()

    useEffect(() => {
        const productoPedidoService = new ProductoPedidoService()
        productoPedidoService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setProductoPedidos(res.data)
                }else{
                    console.log('Error al cargar Datos de ProductoPedido')
                }
            }else{
                console.log('Error de conexion con Backend, Backend esta abajo')
            }
        })
        
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

        
    }, [])
    
    const buscarProductoModificadores = (id) => {
        const _productoModificadores = productoModificadores.filter(value => value.productoIdProducto === id);
        
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
                ...empty,
                productoIdProducto: _producto.idProducto,
                pedidoIdPedido:1 // aqui cambiar el Id de pedido con el de la mesa
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
                ...empty,
                productoIdProducto: _producto.idProducto,
                pedidoIdPedido:1, // aqui cambiar el Id de pedido con el de la mesa
                precio: _producto.precio
            }

            setOpcionesModificadoresProducto(_opcionesM);
            setProductoPedido(_ProductoPedido);
            setDialogVisible2(true);
        }else{

            let _ProductoPedido ={
                ...empty,
                productoIdProducto: _producto.idProducto,
                pedidoIdPedido:1, // aqui cambiar el Id de pedido con el de la mesa
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
        setProductoPedido(empty)
        setOpcionesVariantesProducto(null)
        setOpcionVariante(null)
        setSelected(null)
    }

    const hideDialog2 = () => {
        setSubmitted(false);
        setDialogVisible2(false)
        setProducto(emptyProducto)
        setProductoPedido(empty)
        setOpcionModificador(null)
        setSelected(null)
    }

    const hideDialog3 = () => {
        setSubmitted(false);
        setDialogVisible3(false)
        setProducto(emptyProducto)
        setProductoPedido(empty)
        setSelected(null)
    }

    const saveProductoPedido = async() => {
        setSubmitted(true);

        if(productoPedido.precio && productoPedido.cantidad){
            let _productoPedidos = [...productoPedidos]

            let hoy = new Date();

            let fechaActual = `${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`
            /* let horaActual = `${hoy.getHours()}:${hoy.getMinutes()}:${hoy.getSeconds()}:${hoy.getMilliseconds()}` */
            let horaActual = `${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`
            
            if(opcionVariante){ //Desarrollo guardar Variante
                console.log('Estas aqui 1')
                
                let _ProductoPedido ={
                    ...productoPedido,
                    nombreReferencia: opcionVariante.nombre,
                    total: productoPedido.precio * productoPedido.cantidad,
                    fecha: fechaActual,
                    hora: horaActual,
                }

                delete _ProductoPedido.idProductoPedido
                console.log(_ProductoPedido)
                await productoPedidoService.create(_ProductoPedido).then(res => {
                    if(res){
                        if(res.status >= 200 && res.status<300){

                            _productoPedidos.push(res.data)
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

            }else if(opcionModificador){ //Desarrollo guardar modificador
                console.log('Estas aqui 2')
                let _ProductoPedido ={
                    ...productoPedido,
                    nombreReferencia: opcionModificador.nombre,
                    total: ((productoPedido.precio + productoPedido.modificadorPrecio) * productoPedido.cantidad),
                    fecha: fechaActual,
                    hora: horaActual,
                }

                delete _ProductoPedido.idProductoPedido
                console.log(_ProductoPedido)
                await productoPedidoService.create(_ProductoPedido).then(res => {
                    if(res){
                        if(res.status >= 200 && res.status<300){

                            _productoPedidos.push(res.data)
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
                console.log('Estas aqui 3')
                let _ProductoPedido ={
                    ...productoPedido,
                    total: productoPedido.precio  * productoPedido.cantidad,
                    fecha: fechaActual,
                    hora: horaActual,
                }

                delete _ProductoPedido.idProductoPedido
                console.log(_ProductoPedido)
                await productoPedidoService.create(_ProductoPedido).then(res => {
                    if(res){
                        if(res.status >= 200 && res.status<300){

                            _productoPedidos.push(res.data)
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
            setProductoPedidos(_productoPedidos) 
            setDialogVisible(false)
            setDialogVisible2(false)
            setDialogVisible3(false)
            setProducto(emptyProducto)
            setProductoPedido(empty)
            setOpcionesVariantesProducto(null)
            setOpcionVariante(null)
            setOpcionModificador(null)
            setSelected(null)

        }


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
        const _productoPedidoActual = productoPedidos?.filter(value => value.pedidoIdPedido === pedido.idPedido)
        let total = _productoPedidoActual?.reduce((acc, el) => acc + el.total, 0)
        return formatCurrency(total);
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
                        <img src={`/assets/demo/images/product/black-watch.jpg`} alt={rowData.nombre} />
                        <div className="detalle-producto">
                            <div className="nombreProducto">{rowData.nombre}</div>
                            <i style={{color:`#${_categoria.color}`}} className="pi pi-tag categoriaProductoIcon"></i><span className="categoriaProducto">{_categoria.nombre}</span>
                        </div>
                        <div className="accion-producto">
                            <span className="precio-producto">{rowData.precio ? formatCurrency(rowData.precio) : <span className='variante-producto' >{`${cont} variantes`}</span>}</span>
                        </div>
                    </div>
                </>
            )
        }
    }

    const actionBodyTemplate = () => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined " />
            </div>
        );
    }

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
    
    const header = (
        <div className='p-d-flex p-jc-between' >
            <div>
                <h4><b>Lista de Productos</b></h4>
            </div>

            <div>
                <Dropdown value={categoriaSelected} options={categorias} optionLabel='nombre' optionValue='idCategoria' placeholder='Buscar Categoria' itemTemplate={categoriaItemTemplate} onChange={(e)=>onCategoriaChange(e)} className='p-column-filter' showClear />
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

    let headerGroup = <ColumnGroup>                    
                        <Row>
                            <Column header="Productos"/>
                            <Column header=""/>
                            <Column header="Precio"/>
                            <Column header="Cantidad" />
                            <Column header="Total" />
                            <Column/>
                        </Row>
                    </ColumnGroup>;

    let footerGroup = <ColumnGroup>
                        <Row>
                            <Column footer="Total a Pagar:" colSpan={4} footerStyle={{textAlign:'right'}}/>
                            <Column footer={TotalPagoBodyTemplate}/>
                            <Column/>
                        </Row>
                        </ColumnGroup>;

    return (

        <div className='p-grid p-d-flex' >
                <Toast ref={toast} />
            <div className='p-col-12 p-md-6 '>
                <DataTable dataKey="pedidoIdPedido" value={productoPedidos} header={'Mesa 2'} headerColumnGroup={headerGroup} footerColumnGroup={footerGroup} /* scrollable scrollHeight='400px' */>
                    <Column field="productoIdProducto" body={productoBodyTemplate} />
                    <Column field="nombreReferencia" />
                    <Column field="precio" body={PrecioBodyTemplate} />
                    <Column field="cantidad" style={{padding:'0px 0px 0px 40px'}} />
                    <Column field="total" body={TotalBodyTemplate}/>
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>

            <div className='TablaProductos p-col-12 p-md-6 '>
                <DataTable ref={dt} dataKey='idProducto' value={productos} header={header} scrollable scrollHeight='330px'  
                 selection={selected} onSelectionChange={e => cambiarSelect(e.value)}  selectionMode="single" emptyMessage='No hay Productos Disponibles'>
                    <Column field='categoriaIdCategoria' headerStyle={{display:'none'}} body={ProductoTemplate} />
                </DataTable>
            </div>


            <Dialog visible={dialogVisible} style={{width:'600px'}} header={header1} modal className='p-fluid' footer={dialogFooter} onHide={hideDialog} >
                
                <div className= 'p-grid p-d-flex p-col-12'>
                    {
                        opcionesVariantesProducto?.map((value1) => {
                            return(
                                <div key={value1.idOpcionV} className='p-mr-2 p-my-2 '>
                                    <Button className="p-button-outlined p-button-success BotonPedido" label={value1.nombre} onClick={()=>onInputNumberChangeV(value1.precio, 'precio', value1)}/>
                                </div>
                            )
                        })
                    }
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
                
                <div className= 'p-grid p-d-flex p-col-12'>
                    {
                        opcionesModificadoresProducto?.map((value1) => 
                            <div key={value1.idOpcionM} className='p-mr-2 p-my-2 '>
                                <Button className="p-button-outlined p-button-success" label={value1.nombre} onClick={()=>onInputNumberChangeM(value1.precio,'modificadorPrecio',value1)}/>
                            </div>
                        )
                    }
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
            
        </div>
    );
}

export default DataTableColGroupDemo