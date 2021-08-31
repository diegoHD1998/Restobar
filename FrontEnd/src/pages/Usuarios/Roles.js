import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import RolService from '../../service/UsuariosService/RolService'

export default function Roles ()  {

    let emptyProduct = {
        idRol: null,
        nombre: '',
        
    };

    const [roles, setRoles] = useState(null); /* <----------------- */
    const [rol, setRol] = useState(emptyProduct);/* <----------------- */
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setloading] = useState(true)
    const toast = useRef(null);
    const dt = useRef(null);

    const rolService = new RolService();/* <----------------- */

    useEffect(() => {
        const rolService = new RolService();
        rolService.readAll().then(res =>{
            if(res.status >= 200 && res.status <300){
                setRoles(res.data)
                setloading(false)
            }else{
                console.log('Error al Cargar Datos de Roles')
            }
        });
    },[]);


    const openNew = () => {
        setRol(emptyProduct);
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

    const saveProduct = async() => { /* <----------------- */
        setSubmitted(true);

        if (rol.nombre.trim()) {
            let _roles = [...roles];
            let _rol = { ...rol };

            if (rol.idRol) {
                await rolService.update(rol)
                .then(res => {
                    if(res.status >= 200 && res.status <300){

                        const index = findIndexById(rol.idRol);
                        _roles[index] = _rol;
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Rol Actualizado', life: 3000 });
                        console.log(res)

                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Update Rol, Status No Controlado`, life: 5000 });
                    }
                });
            }
            else {
                delete _rol.idRol;
                await rolService.create(_rol)
                .then(res => {
                    if(res.status >= 200 && res.status <300){
                        _roles.push(res.data);
                        toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Rol Creado', life: 3000 });
                        console.log(res.data)
                    }else if(res.status >= 400 && res.status < 500){
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
                    }else{
                        console.log(res)
                        toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Create Rol, Status No Controlado`, life: 5000 });
                    }
                });
            }

            setRoles(_roles);
            setProductDialog(false);
            setRol(emptyProduct);
        }
    }

    const editProduct = (product) => {/* <----------------- */
        setRol({ ...product });
        setProductDialog(true);
    }

    const confirmDeleteProduct = (product) => {/* <----------------- */
        setRol(product);
        setDeleteProductDialog(true);
    }

    const deleteProduct = async() => { // <------------------------
        await rolService.delete(rol.idRol)
        .then(res => {
            if(res.status >= 200 && res.status <300){
                console.log(res.data)
                setRoles(roles.filter(val => val.idRol !== res.data))
                setDeleteProductDialog(false);
                setRol(emptyProduct);
                toast.current.show({ severity: 'success', summary: 'Operacion Exitosa', detail: 'Rol Eliminado', life: 3000 });
            }else if(res.status >= 400 && res.status < 500){
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `${res.data}`, life: 5000 });
            }else{
                console.log(res)
                toast.current.show({ severity: 'error', summary: 'Operacion Fallida', detail: `Error en Delete Rol, Status No Controlado`, life: 5000 });
            }
        })
    }

    const findIndexById = (idRol) => {/* <----------------- */
        let index = -1;
        for (let i = 0; i < roles.length; i++) {
            if (roles[i].idRol === idRol) {
                index = i;
                break;
            }
        }

        return index;
    }

    const onInputChange = (e, name) => {/* <----------------- */
        const val = (e.target && e.target.value) || '';
        let _product = { ...rol };
        _product[`${name}`] = val;

        setRol(_product);
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
            <h5 className="p-m-0">Administracion de Roles</h5>
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

                    <DataTable ref={dt} value={roles} 
                        dataKey="idRol" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Roles"
                        globalFilter={globalFilter} emptyMessage="Roles No Encontrados." header={header} loading={loading} >
                        <Column field="nombre" header="Rol" sortable ></Column>
                        <Column body={actionBodyTemplate}></Column>

                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Detalle Rol" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        
                        <div className="p-field">
                            <label htmlFor="nombre">Nombre</label>
                            <InputText id="nombre" value={rol.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !rol.nombre })} />
                            {submitted && !rol.nombre && <small className="p-invalid">Nombre Requerido.</small>}
                        </div>

                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="confirmation-content">
                            <i className="pi pi-exclamation-triangle p-mr-3" style={{ fontSize: '2rem' }} />
                            {rol && <span>Estas seguro que quieres eliminar el Rol <b>{rol.nombre}</b>?</span>}
                        </div>
                    </Dialog>

                </div>
            </div>
        </div>
    );
}