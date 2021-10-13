
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import {InputNumber} from 'primereact/inputnumber'
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Row } from 'primereact/row';
/* import { Toast } from 'primereact/toast'; */

import ProductoService from '../service/ProductosService/ProductoService';
import CategoriaService from '../service/ProductosService/CategoriaService';
/* import VarienteService from '../service/ProductosService/VarianteService'; */
import OpcionVarienteService from '../service/ProductosService/OpcionVarianteService';
/* import ModificadorService from '../service/ProductosService/ModificadorService'; */
import OpcionModificadorService from '../service/ProductosService/OpcionModificadorService';

import ProductoModificadorService from '../service/ProductosService/ProductoModificadorService';



const DataTableColGroupDemo = () => {


    let empty = {
        productoIdProducto: null,
        pedidoIdPedido: null,
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

    const [productoPedido, setProductoPedido] = useState(empty)
    const [producto, setProducto] = useState(emptyProducto)
    const [opcionVariante, setOpcionVariante] = useState(null)

    const [productos, setProductos] = useState(null)
    const [categorias, setCategorias] = useState(null)

    const [categoriaSelected, setCategoriaSelected] = useState(null)


    /* const [variantes, setVariantes] = useState(null) */
    const [opcionVariantes, setOpcionVariantes] = useState(null)
    const [opcionesVariantesProducto, setOpcionesVariantesProducto] = useState(null)
    
    const [productoModificadores, setProductoModificadores] = useState(null)
    /* const [modificadores, setModificadores] = useState(null) */
    const [opcionModificadores, setOpcionModificadores] = useState(null)
    const [opcionesModificadoresProducto, setOpcionesModificadoresProducto] = useState(null)
    
    const [selected, setSelected] = useState(null);
    const dt = useRef(null);
    
    const pedido = {idPedido:501, fecha:'04-10-2021', estado: 'Activo', usuarioIdUsuario:1, mesaIdMesa:2}

    const productoPedidos = [
        {productoIdProducto: 4, pedidoIdPedido:501, nombre:'', cantidad: 1, precio: 6000, nombreReferencia:'', modificadorPrecio: null, total:6000, fecha:null, hora:null},
        {productoIdProducto: 5, pedidoIdPedido:501, nombre:'', cantidad: 2, precio: 10000, nombreReferencia:'', modificadorPrecio: null, total:20000, fecha:null, hora:null},
        {productoIdProducto: 6, pedidoIdPedido:501, nombre:'', cantidad: 1, precio: 6000, nombreReferencia:'', modificadorPrecio: null, total:6000, fecha:null, hora:null},
        {productoIdProducto: 7, pedidoIdPedido:501, nombre:'', cantidad: 3, precio: 500, nombreReferencia:'', modificadorPrecio: null, total:1500, fecha:null, hora:null},
    ];
    
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogVisible2, setDialogVisible2] = useState(false);
    const [dialogVisible3, setDialogVisible3] = useState(false);

    const [submitted, setSubmitted] = useState(false);

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
            setOpcionesVariantesProducto(_opcionesV)
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
                precio: _producto.precio
            }

            setOpcionesModificadoresProducto(_opcionesM);
            setProductoPedido(_ProductoPedido);
            setDialogVisible2(true);
        }else{

            let _ProductoPedido ={
                ...empty,
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
        setSelected(null)
        setOpcionVariante(null)
    }

    const hideDialog2 = () => {
        setSubmitted(false);
        setDialogVisible2(false)
        setProducto(emptyProducto)
        setProductoPedido(empty)
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

        if(productoPedido.modificadorPrecio !== null){

        }else{
            
        }

    }

    

    const guardarPedido = async() =>{
        setSubmitted(true);
        if(true){
            

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
        console.log(val)
        setProductoPedido(_productoPedido);
        setOpcionVariante(opcionV)
    }

    const onInputNumberChangeM = (value, name) => {
        const val = value || 0;
        let _productoPedido = {...productoPedido};
        _productoPedido[`${name}`] = val;
        console.log(val)
        setProductoPedido(_productoPedido);
    }
    const actionBodyTemplate = () => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-outlined " />
            </div>
        );
    }
    const PrecioBodyTemplate = (rowData) => {
        return rowData.precio.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
    }
    
    const TotalBodyTemplate = (rowData) => {
        return rowData.total.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
    }
    
    const formatCurrency = (value) => {
        return value.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
    }
    const TotalPagoBodyTemplate = () => {
        
        const _productoPedidoActual = productoPedidos.filter(value => value.pedidoIdPedido === pedido.idPedido)
        
        let total = _productoPedidoActual.reduce((acc, el) => acc + el.total, 0)
        
        return formatCurrency(total);
    }

    const categoriaItemTemplate = (option) => {
        return <span>{option.nombre}</span>
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

    let headerGroup = <ColumnGroup>
                        <Row>
                            <Column header="Productos" rowSpan={3} />
                        </Row>
                        
                        <Row>
                            <Column header="Precio"/>
                            <Column header="Cantidad" />
                            <Column header="Total" />
                            <Column/>
                        </Row>
                    </ColumnGroup>;

    let footerGroup = <ColumnGroup>
                        <Row>
                            <Column footer="Total a Pagar:" colSpan={3} footerStyle={{textAlign:'right'}}/>
                            <Column footer={TotalPagoBodyTemplate}/>
                            <Column/>
                        </Row>
                        </ColumnGroup>;


    const dialogFooter = (
        <>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
            <Button label='Guardar' icon='pi pi-check' className='p-button-text' onClick={()=>console.log(productoPedido)} />
        </>
    );

    const dialogFooter2 = (
        <>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog2} />
            <Button label='Guardar' icon='pi pi-check' className='p-button-text' onClick={()=>console.log(productoPedido)} />
        </>
    );

    const dialogFooter3 = (
        <>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog3} />
            <Button label='Guardar' icon='pi pi-check' className='p-button-text' onClick={()=>console.log(productoPedido)} />
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
            <span><b> {`${producto.nombre.toUpperCase()} ${opcionVariante ? opcionVariante.nombre : ''} : `}</b> </span>
            <span>{`${formatCurrency(productoPedido.precio)}`}</span>
        </div>
    
    )

    return (
        <div className='p-grid p-d-flex' >
            

            <div className='p-col-12 p-md-6 '>
                <DataTable dataKey="pedidoIdPedido" value={productoPedidos} header={'Mesa 2'} headerColumnGroup={headerGroup} footerColumnGroup={footerGroup} /* scrollable scrollHeight='400px' */>
                    <Column field="productoIdProducto" body={productoBodyTemplate} />
                    <Column field="precio" body={PrecioBodyTemplate} />
                    <Column field="cantidad" style={{padding:'0px 0px 0px 40px'}} />
                    <Column field="total" body={TotalBodyTemplate}/>
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>

            <div className='TablaProductos p-col-12 p-md-6 '>
                <DataTable ref={dt} dataKey='idProducto' value={productos} header={header} scrollable scrollHeight='400px'  
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




            <Dialog visible={dialogVisible2} style={{width:'600px'}} header={`${producto.nombre.toUpperCase()}: ${formatCurrency(productoPedido.precio)}`} modal className='p-fluid' footer={dialogFooter2} onHide={hideDialog2} >
                
                <div className= 'p-grid p-d-flex p-col-12'>
                    {
                        opcionesModificadoresProducto?.map((value1) => 
                            
                            <div key={value1.idOpcionM} className='p-mr-2 p-my-2 '>
                                <Button className="p-button-outlined p-button-success" label={value1.nombre} onClick={()=>onInputNumberChangeM(value1.precio,'modificadorPrecio')}/>
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
                    <span style={{fontSize:'25px'}} > <b>{`TOTAL: ${formatCurrency((productoPedido.precio * productoPedido.cantidad) + (productoPedido.modificadorPrecio * productoPedido.cantidad))}`}</b> </span>
                </div>

            </Dialog>




            <Dialog visible={dialogVisible3} style={{width:'400px'}} header={`${producto.nombre.toUpperCase()}: ${formatCurrency(productoPedido.precio)} `} modal className='p-fluid' footer={dialogFooter3} onHide={hideDialog3} >

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