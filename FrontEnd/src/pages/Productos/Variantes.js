import React, { useState, useEffect, useRef } from 'react';
/* import { Link } from 'react-router-dom'; */
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import VarienteService from '../../service/ProductosService/VarianteService'
import OpcionVarianteService from '../../service/ProductosService/OpcionVarianteService'

/* import OpcionVariante from './OpcionVariante' */


export default function Variantes ()  {

    let emptyProduct = {
        idVariante: null,
        nombre: ''
    };

    let emptyOpcionVariante = {
        idOpcionV: null,
        nombre: '',
        precio: null,
        varianteIdVariante: null,
        orden: null
    }

    const numerosOrden = [1,2,3,4,5,6]

    const [variantes, setVarientes] = useState(null);
    const [variante, setVariante] = useState(emptyProduct);

    const [opcionVariantes, setOpcionVariantes] = useState(null);
    const [opcionVariante, setOpcionVariante] = useState(emptyOpcionVariante);

    const [opcionDialog, setOpcionDialog] = useState(false);
    const [submitted2, setSubmitted2] = useState(false);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [opciones, setOpciones] = useState(null)
    const [opcion, setOpcion] = useState('')
    const ocultarDialog = () =>{
        setDialogVisible(false)
    }

    const [loading, setloading] = useState(true)
    
    
    
    const varienteService = new VarienteService(); 
    const opcionVarianteService = new OpcionVarianteService()

    useEffect(() => {

        const varienteService = new VarienteService();
        varienteService.readAll().then((res) => {
            if(res.status >= 200 && res.status<300){
                setVarientes(res.data)
                setloading(false)
            }else{
                console.log('Error al cargar Datos de Variantes')
            }
            
        });


        const opcionVarianteService = new OpcionVarianteService();
        opcionVarianteService.readAll().then((res) => {
            if(res.status >= 200 && res.status<300){
                setOpcionVariantes(res.data)
            }else{
                console.log('Error al cargar Datos de OpcionVariantes')
            }
        });
        

    }, []);

    const abrirOpciones = (rowData) =>{
        setOpcion(rowData.nombre)
        setOpciones(EncontrarOpciones(rowData))
        setDialogVisible(true)
    }


    const openNew = () => {
        setVariante(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    }

    const openNewOpcion = (data) => {/* -------Nuevo-------- */
        setOpcionVariante(emptyOpcionVariante);
        setOpcionVariante({varianteIdVariante: data.idVariante})
        setSubmitted2(false);
        setOpcionDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    }

    const hideDialogOpcion = () => {/* -------Nuevo-------- */
        setSubmitted2(false);
        setOpcionDialog(false);
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    }

    const saveProduct = async() => { 
        setSubmitted(true);

        if (variante.nombre.trim()) {
            let _variantes = [...variantes];
            let _variante = { ...variante };

            if (variante.idVariante) {
                await varienteService.update(variante)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        const index = findIndexById(variante.idVariante);
                        _variantes[index] = _variante;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Variante Actualizada', life: 3000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update de Variante, Status no controlado`, life: 5000 });
                    }
                    

                })
            }
            else {
                delete _variante.idVariante;
                await varienteService.create(_variante)
                .then(res => {
                    if(res.status >= 200 && res.status<300){

                        _variantes.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Variante Creada', life: 3000 });
                        console.log(res.data)

                    }else if(res.status >= 400 && res.status<500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Variante, Status No controlado`, life: 5000 });
                    }
                });
            }

            setVarientes(_variantes);
            setProductDialog(false);
            setVariante(emptyProduct);
        }
    }

    /* -------Nuevo-------- */
    /* -------------------------------------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------------------------------------- */
    
    const saveOpcionVariante = async() => { 
        setSubmitted2(true);

        if (opcionVariante.nombre.trim() && opcionVariante.precio.trim()) {
            let _OpcionVariantes = [...opcionVariantes];
            let _OpcionVariante = { ...opcionVariante };
            
            delete _OpcionVariante.idOpcionV;
            await opcionVarianteService.create(_OpcionVariante)
            .then(res => {
                if(res.status >= 200 && res.status<300){
                    _OpcionVariantes.push(res.data);
                    toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Opcion Variante Creada', life: 3000 });
                    console.log(res.data)
                }else if(res.status >= 400 && res.status<500){
                    console.log(res)
                    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                }else{
                    console.log(res)
                    toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create OpcionVariante, Status No controlado`, life: 5000 });
                }
            });

            setOpcionVariantes(_OpcionVariantes);
            setOpcionDialog(false);
            setOpcionVariante(emptyOpcionVariante);
        }
    }

    const editProduct = (product) => {
        setVariante({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {
        setVariante(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { 
        await varienteService.delete(variante.idVariante)
        .then(res => {

            if(res.status >= 200 && res.status < 300){
                setVarientes(variantes.filter(val => val.idVariante !== res.data))
                setDeleteProductDialog(false);
                setVariante(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Variante Eliminada', life: 3000 });

            }else if(res.status >= 400 && res.status < 500){
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Variante, Status No controlado`, life: 5000 });
            }
        });
    }

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < variantes.length; i++) {
            if (variantes[i].idVariante === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const findIndexById2 = (id) => {/* -------Nuevo-------- */
        let index = -1;
        for (let i = 0; i < opcionVariantes.length; i++) {
            if (opcionVariantes[i].idVariante === id) {
                index = i;
                break;
            }
        }

        return index;
    }


    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...variante };
        _product[`${name}`] = val;

        setVariante(_product);
    };

    const onInputChanceOpcionVariante = (e, name) => {/* -------Nuevo-------- */
        const val = (e.target && e.target.value) || '';
        let _opcionV = { ...opcionVariante };
        _opcionV[`${name}`] = val;

        setOpcionVariante(_opcionV);
    }

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Nuevo" icon="pi pi-plus" className="p-button-success p-mr-2" onClick={openNew} />
                
            </React.Fragment>
        )
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-search" className="p-button-rounded p-button-info p-mr-2" tooltip='Ver detalle opciones' tooltipOptions={{position: 'top'}} onClick={()=> abrirOpciones(rowData)} />
                <Button icon="pi pi-plus" className="p-button-rounded p-button-secondary p-mr-2" tooltip='Agregar Opciones' tooltipOptions={{position: 'top'}} onClick={() => openNewOpcion(rowData)} />
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success p-mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="table-header">
            <h5 className="p-m-0">Administracion de Variantes</h5>
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const header2 = (/* -------Nuevo-------- */
        <div className="table-header">
            <h6 className="p-m-0">Opciones Variantes</h6>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );

    const opcionDialogFooter = (/* -------Nuevo-------- */
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialogOpcion} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveOpcionVariante} />
        </>
    );

    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );

    const EncontrarOpciones = (rowData) => {
        return opcionVariantes.filter(opcion => opcion?.varianteIdVariante === rowData?.idVariante) // Aqui estan todos los datos de la OpcionVariantes
    }

    const BodyOpcionVarianteEnTabla = (rowData) => {/* -------Nuevo-------- */

        if(opcionVariantes){

            let _opciones = EncontrarOpciones(rowData) 
            
            let texto = ''

            _opciones.map(opcion => {

                if(_opciones.indexOf(opcion) !== _opciones.length - 1){
                    texto += `${opcion.nombre}, `
                }else{
                    texto += `${opcion.nombre}. `
                }
            })
            

            if(_opciones){
                return (
                    <>
                        <div>
                            <span>{texto}</span>
                        </div>
                    </>
                );
            }else{
                console.log('Esta Variante no posee opciones')
            }
        }else{
            console.log('No hay data de opciones')
        }
    }

    const MonedaBodyTemplate = (rowData) => {/* -------Nuevo-------- */

        return formatCurrency(rowData.precio)

    }

    const formatCurrency = (value) => {/* -------Nuevo-------- */
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits:0});
    }


    return (
        
        <div className="p-grid crud-demo">
            <div className="p-col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="p-mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={variantes}
                        dataKey="idVariante" paginator rows={5} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Zonas"
                        globalFilter={globalFilter} emptyMessage="Variantes No Encontradas." header={header} loading={loading}>
                        
                        <Column field="nombre" header="Nombre" sortable ></Column>
                        <Column field="idVariante" header="OpcionVariante" body={BodyOpcionVarianteEnTabla}  sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px'}} header="Detalle Variante " modal className="p-fluid " footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={variante.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !variante.nombre })} />
                            {submitted && !variante.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                    </Dialog>

                    {/* -------Nuevo-------- */}
                    {/* Dialog Para ingresar una nueva opcionVariante */}
                    <Dialog visible={opcionDialog} style={{ width: '450px'}} header="Opcion Variante " modal className="p-fluid " footer={opcionDialogFooter} onHide={hideDialogOpcion}>
                        
                        <div className="p-field" style={{ marginBottom: '40px'}} >
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={opcionVariante.nombre} onChange={(e) => onInputChanceOpcionVariante(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !opcionVariante.nombre })} />
                            {submitted2 && !opcionVariante.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>
                        
                        <div className="p-field" style={{ marginBottom: '40px'}}>
                            <label htmlFor="precio">Precio</label>
                            <InputText id="precio" value={opcionVariante.precio} onChange={(e) => onInputChanceOpcionVariante(e, 'precio')} required  className={classNames({ 'p-invalid': submitted && !opcionVariante.precio })} />
                            {submitted2 && !opcionVariante.precio && <small className="p-invalid">Precio Requerido.</small>}
                        </div>

                        <div className="p-field" >
                            <label htmlFor="orden">Orden</label>
                            <Dropdown id="orden" value={opcionVariante.orden} options={numerosOrden} placeholder='Seleccione Orden' onChange={(e) => onInputChanceOpcionVariante(e, 'orden')} />
                        </div>
                        
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirmar" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {variante && <span>Estas seguro que quieres eliminar la Variente <b>{variante.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                    <Dialog visible={dialogVisible} style={{ width: '600px'}} header={`Detalle de opciones de Variante: ${opcion} `} modal className="p-fluid " onHide={ocultarDialog}>

                        <DataTable value={opciones} className="datatable-responsive">
                            <Column field="nombre" header="Nombre" sortable></Column>
                            <Column field="precio" header="Precio" body={MonedaBodyTemplate} sortable></Column>
                            <Column field="orden" header="Orden" sortable></Column>
                        </DataTable>

                    </Dialog>

                </div>
            </div>
        </div>
    );
}