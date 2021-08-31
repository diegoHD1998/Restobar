import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import ProductoService from '../../service/ProductosService/ProductoService'
import CategoriaService from '../../service/ProductosService/CategoriaService'




export default function Productos ()  {

    let emptyProduct = {
        idProducto: null,
        nombre: '',
        descripcion: '',
        precio: null,
        imagen:'',
        estado:'',
        categoriaIdCategoria:null
    };

    const [productos, setProductos] = useState(null); /* <----------------- */
    const [producto, setProducto] = useState(emptyProduct);/* <----------------- */
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);
    
    const [categorias, setCategorias] = useState([])

    const [loading, setloading] = useState(true)
    
    
    
    const productoService = new ProductoService(); 

    useEffect(() => {

        const categoriaService = new CategoriaService(); 
        categoriaService.readAll().then((res) => {
            if(res.status >= 200 && res.status<300){
                setCategorias(res.data)
                setloading(false)
                console.log(categorias)
            }else{
                console.log('Error al cargar Datos de Categoria')
            }
        });


        const productoService = new ProductoService();
        productoService.readAll().then((res) => {
            if(res.status >= 200 && res.status<300){
                setProductos(res.data)
            }else{
                console.log('Error al cargar Datos de Productos')
            }
        });

    }, []);

    let estadoProducto = [
        'Activo',
        'Inactivo'
    ];


    const openNew = () => {
        setProducto(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const saveProduct = async() => { 
        setSubmitted(true);

        if (producto.nombre.trim() && producto.estado.trim() && producto.precio != null && producto.categoriaIdCategoria != null) {
            let _productos = [...productos];
            let _producto = { ...producto };

            if (producto.idProducto) {
                await productoService.update(producto)
                .then(res => {

                    if(res.status >= 200 && res.status<300){

                        const index = findIndexById(producto.idProducto);
                        _productos[index] = _producto;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto Actualizado', life: 3000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Producto, Status no controlado`, life: 5000 });
                    }
                    

                })
            }
            else {
                delete _producto.idProducto;
                await productoService.create(_producto)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        _productos.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto Creado', life: 3000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Producto, Status No controlado`, life: 5000 });
                    }
                });
            }

            setProductos(_productos);
            setProductDialog(false);
            setProducto(emptyProduct);
        }
    }

    const editProduct = (product) => {/* <----------------- */
        setProducto({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {/* <----------------- */
        setProducto(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { 
        await productoService.delete(producto.idProducto)
        .then(res => {

            if(res.status >= 200 && res.status < 300){

                setProductos(productos.filter(val => val.idProducto !== res.data))
                setDeleteProductDialog(false);
                setProducto(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Producto Eliminado', life: 3000 });

            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Producto, Status No controlado`, life: 5000 });
            }
        });
    }

    const findIndexById = (id) => {/* <----------------- */
        let index = -1;
        for (let i = 0; i < productos.length; i++) {
            if (productos[i].idProducto === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onInputChange = (e, name) => {/* <----------------- */
        const val = (e.target && e.target.value) || '';
        let _product = { ...producto };
        _product[`${name}`] = val;

        setProducto(_product);
    }
    
    const ColorBodytemplate = (rowData) => {

        if(categorias){

            let _categoria = categorias.find(val => val?.idCategoria === rowData?.categoriaIdCategoria)  // Aqui estan todos los datos de la zona 

            return (
                <>
                    <div className={`cuadro1`} style={{background:`#${_categoria?.color}`}}>
                    <span className={`texto1`}>{`${_categoria?.nombre}`}</span>
                    </div>
                </>
            );
        }
    }

    const MonedaBodyTemplate = (rowData) => {

        return formatCurrency(rowData.precio)

    }

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits:0});
    }
    


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                
            </React.Fragment>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    }

    const header = (/* <----------------- */
        <div className="table-header">
            <h5 className="p-m-0">Administracion de Productos</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    return (
        
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={productos}
                        dataKey="idproducto" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Productos"
                        globalFilter={globalFilter} emptyMessage="Productos No Encontrados." header={header} loading={loading}>
                        
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="descripcion" header="Descripcion" sortable ></Column>
                        <Column field="precio" body={MonedaBodyTemplate} header="Precio" sortable ></Column>
                        <Column field="imagen" header="Imagen" sortable ></Column>
                        <Column field="estado" header="Estado" sortable ></Column>
                        <Column field="categoriaIdCategoria" body={ColorBodytemplate} header="Categoria" sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px'}} header="Detalle Producto " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={producto.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !producto.nombre })} />
                            {submitted && !producto.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                        <div className="p-field">
                            <label htmlFor="descripcion">Descripcion</label>
                            <InputTextarea id="descripcion" value={producto.descripcion} onChange={(e) => onInputChange(e, 'descripcion')}/>
                            
                        </div>

                        <div className="p-field">
                            <label htmlFor="precio">Precio</label>
                            <InputText id="precio" value={producto.precio} onChange={(e) => onInputChange(e, 'precio')} required className={classNames({ 'p-invalid': submitted && !producto.precio })} />
                            {submitted && !producto.precio && <small className="p-invalid">Precio Requerido.</small>}
                        </div>


                        <div className="p-field" /* style={{height:'100px'}} */>
                            <label htmlFor="estado">Estado</label>
                            <Dropdown id="estado" value={producto.estado} options={estadoProducto} placeholder='Seleccione Estado' onChange={(e) => onInputChange(e, 'estado')} required className={classNames({ 'p-invalid': submitted && !producto.estado })}rows={3} cols={20} />
                            {submitted && !producto.estado && <small className="p-invalid">Estado Requerido.</small>}
                        </div>

                        <div className="p-field" >
                            <label htmlFor="categoriaIdCategoria">Categoria</label>
                            <Dropdown id="categoriaIdCategoria" optionLabel="nombre" optionValue="idCategoria" value={producto.categoriaIdCategoria} options={categorias} placeholder='Seleccione Categoria' onChange={(e) => onInputChange(e, 'categoriaIdCategoria')} required className={classNames({ 'p-invalid': submitted && !producto.categoriaIdCategoria })}rows={3} cols={20} />
                            {submitted && !producto.categoriaIdCategoria && <small className="p-invalid">Categoria Requerida.</small>}
                        </div>

                        <div className="p-field" style={{height:'150px'}}>
                            <label htmlFor="imagen">Imagen</label>
                            <InputText id="imagen" value={producto.imagen} onChange={(e) => onInputChange(e, 'imagen')} /* className={classNames({ 'p-invalid': submitted && !producto.imagen })} */ />
                            {/* {submitted && !producto.imagen && <small className="p-invalid">Imagen Requerida.</small>} */}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {producto && <span>Estas seguro que quieres eliminar el producto <b>{producto.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}
