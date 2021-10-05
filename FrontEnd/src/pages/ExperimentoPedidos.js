
import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
import { Row } from 'primereact/row';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

import ProductoService from '../service/ProductosService/ProductoService';
import CategoriaService from '../service/ProductosService/CategoriaService';
import VarienteService from '../service/ProductosService/VarianteService';
import OpcionVarienteService from '../service/ProductosService/OpcionVarianteService';
import ModificadorService from '../service/ProductosService/ModificadorService';
import OpcionModificadorService from '../service/ProductosService/OpcionModificadorService';
import { NULL } from 'node-sass';


const DataTableColGroupDemo = () => {


    let empty = {
        productoIdProducto: null,
        pedidoIdPedido: null,
        cantidad: 1,
        total: null,
        hora: '',
        precioUnidad: null,
        opcionVariante:''
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

    const [productos, setProductos] = useState(null)
    const [categorias, setCategorias] = useState(null)
    const [variantes, setVariantes] = useState(null)
    const [opcionVariantes, setOpcionVariantes] = useState(null)
    const [modificadores, setModificadores] = useState(null)
    const [opcionModificadores, setOpcionModificadores] = useState(null)

    


    const pedidos = [
        {idPedido:501, fecha:'04-10-2021', estado: 'Activo', usuarioIdUsuario:1, mesaIdMesa:2}
    ]

    const productoPedidos = [
        {productoIdProducto: 1, pedidoIdPedido:501, cantidad: 5, total:1000 , hora:'10:44:12'},
        {productoIdProducto: 2, pedidoIdPedido:501, cantidad: 2, total:1000 , hora:'10:44:12'},
        {productoIdProducto: 3, pedidoIdPedido:501, cantidad: 1, total:1000 , hora:'10:44:12'},
        {productoIdProducto: 4, pedidoIdPedido:501, cantidad: 7, total:1000 , hora:'10:44:12'},
        {productoIdProducto: 5, pedidoIdPedido:501, cantidad: 7, total:1000 , hora:'10:44:12'},
    ];
    
    const [dialogVisible, setDialogVisible] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        
        const productoService = new ProductoService();
        productoService.readAll().then(res => {
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

        const categoriaService = new CategoriaService();
        categoriaService.readAll().then(res => {
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

        const varianteService = new VarienteService();
        varianteService.readAll().then(res => {
            if(res){
                if(res.status >= 200 && res.status < 300){
                    setVariantes(res.data)
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
        
        
    }, [])


    const hideDialog = () => {
        setSubmitted(false);
        setDialogVisible(false);
        setProducto(emptyProducto)

    }


    const BodyTemplate = (_productoPedido) => {

        let producto = productos.find(value => value.idProducto === _productoPedido.productoIdProducto )

        let total = 0
        let cantidad = _productoPedido.cantidad
        
        if(producto.varianteIdVariante){
            let precio = _productoPedido
            
            
        }else{  
            total = cantidad * producto.precio
        }
        

        return `${formatCurrency(total)}`;
    }

    const formatCurrency = (value) => {
        return value.toLocaleString('es-CL', {style: 'currency', currency: 'CLP'});
    }

    const thisYearTotal = () => {
        
        let total = productoPedidos.reduce((acc, el) => acc + (el.precio * el.cantidad), 0)
        return formatCurrency(total);
    }

    const guardarPedido = async() =>{
        setSubmitted(true);
        if(true){
            

        }
    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...producto };
        _product[`${name}`] = val;

        setProducto(_product);
    }
    
    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _productoPedido = {...productoPedido};
        _productoPedido[`${name}`] = val;

        setProductoPedido(_productoPedido);
    }

    let headerGroup = <ColumnGroup>
                        <Row>
                            <Column header="Productos" rowSpan={3} />
                        </Row>
                        
                        <Row>
                            <Column header="Cantidad" />
                            <Column header="Precio"/>
                            <Column />
                        </Row>
                    </ColumnGroup>;

    let footerGroup = <ColumnGroup>
                        <Row>
                            <Column footer="Total a Pagar:" colSpan={2} footerStyle={{textAlign:'right'}}/>
                            <Column /* footer={thisYearTotal}  */ />
                            <Column/>
                        </Row>
                        </ColumnGroup>;

    const actionBodyTemplate = () => {
        return (
            <div className="actions">
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" />
            </div>
        );
    }

    const dialogFooter = (
        <>
            <Button label='Cancelar' icon='pi pi-times' className='p-button-text' onClick={hideDialog} />
            <Button label='Guardar' icon='pi pi-check' className='p-button-text' onClick={} />
        </>
    );

    const itemTemplate = (producto) => {

        let categoria = categorias.find(value => value.idCategoria === producto.categoriaIdCategoria)

        return (
            <div className="product-item" onClick={()=> setProducto(producto)} >
                <img src={`/assets/demo/images/product/black-watch.jpg`} alt={producto.nombre} />
                <div className="product-detail">
                    <div className="product-name">{producto.nombre}</div>
                    
                    <i className="pi pi-tag product-category-icon"></i><span className="product-category">{categoria}</span>
                </div>
                <div className="product-action">
                    <span className="product-price">{formatCurrency(producto.precio)}</span>
                </div>
            </div>
        );
    }
    


    return (
        <div className='p-grid p-d-flex' >
            

            <div className='p-col-12 p-md-6 '>
                <DataTable value={productoPedidos} headerColumnGroup={headerGroup} footerColumnGroup={footerGroup}>
                    <Column field="nombre" />
                    <Column field="cantidad" style={{padding:'0px 0px 0px 40px'}} />
                    <Column field="total"  body={BodyTemplate} />
                    <Column body={actionBodyTemplate}/>
                </DataTable>
            </div>

            <div className='datascroller-demo p-col-12 p-md-6 '>
                <DataScroller value={productos} itemTemplate={itemTemplate} rows={6} inline scrollHeight="400px" header="Productos" emptyMessage='No hay Productos Disponibles' />            
            </div>

            <Dialog visible={dialogVisible} style={{width:'600px'}} header='Agregar Producto' modal className='p-fluid' footer={} onHide={hideDialog} >
                <div className= 'p-field p-col-12'>
                    {
                        opcionVariantes?.map((value1) => {
                            if (value1.varianteIdVariante === producto.varianteIdVariante) {
                                return(
                                    <div>
                                        <Button label={value1.nombre} value={value1.precio} onChange={(e) => onInputNumberChange(e, 'precioUnidad')} className="p-button-outlined p-button-success" />
                                    </div>
                                )
                            }
                        })
                    }
                </div>

                <div className="p-field p-col-12 p-md-3">
                    <label htmlFor="horizontal">Cantidad</label>
                    <InputNumber inputId="horizontal" min={0} value={productoPedido.cantidad} onChange={(e) => onInputNumberChange(e, 'cantidad')} showButtons buttonLayout="horizontal" step={1}
                        decrementButtonClassName="p-button-info" incrementButtonClassName="p-button-info" incrementButtonIcon="pi pi-plus" decrementButtonIcon="pi pi-minus"/>
                </div>

            </Dialog>
            
        </div>
    );
}

export default DataTableColGroupDemo