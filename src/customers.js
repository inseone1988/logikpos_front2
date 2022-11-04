import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";
import "moment/dist/locale/es-mx";
import moment from "moment";
import Swal from 'sweetalert2';

moment.locale("es-mx");

function CustomerEditor(props) {

    return (
        <div className="row">
            <div className="col-xxsm-12 col-sm-6 col-md-4">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Nombre</label>
                    <input defaultValue={props.customer ? props.customer.name : ""} name="name"
                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-xxsm-12 col-sm-6 col-md-4">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Apellido paterno</label>
                    <input defaultValue={props.customer ? props.customer.lastName : ""} name="lastName"
                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-xxsm-12 col-sm-6 col-md-4">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Apellido materno</label>
                    <input defaultValue={props.customer ? props.customer.surName : ""} name="surName"
                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-xxsm-12 col-sm-6 col-md-4">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Limite de credito</label>
                    <input defaultValue={props.customer ? props.customer.creditLimit : ""} name="creditLimit"
                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-sm-12 col-md-4 mb-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Telefono</label>
                    <input defaultValue={props.customer ? props.customer.phone : ""} name="phone"
                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-12 mb-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Direccion</label>
                    <textarea defaultValue={props.customer ? props.customer.address : ""} name="address"
                              onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                              className="form-control"/>
                </div>
            </div>
            <div className="col-12 mb-3">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <h5>Datos fiscales (Facturacion)</h5>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">RFC</label>
                                    <input defaultValue={props.customer ? props.customer.taxId : ""} name="taxId"
                                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)}
                                           type="text" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Razon social</label>
                                    <input defaultValue={props.customer ? props.customer.businessName : ""}
                                           name="businessName"
                                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)}
                                           type="text" className="form-control"/>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">Codigo postal</label>
                                    <input defaultValue={props.customer ? props.customer.zipCode : ""} name="zipCode"
                                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)}
                                           type="text" className="form-control"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 d-flex justify-content-end align-content-end">
                <button className={`btn btn-danger mr-3 ${props.customer.id?"":"d-none"}`} onClick={props.onDelete}>Eliminar</button>
                <button className="btn btn-primary" onClick={props.onSave}>Guardar</button>
            </div>
        </div>
    );
}

function CustomerInfo(props) {

    return (
        <div className="row">

        </div>
    );
}

function ExistentCustomersView(props) {

    const rows = props.customers.length ? props.customers.map((e, i) => {
        return (<tr key={i} onDoubleClick={() => props.setEditMode(e, i)}>
            <td>{e.fullName}</td>
            <td>{e.businessName}</td>
            <td>{e.phone}</td>
            <td>{moment(e.updated_at).format("DD MMMM YYYY h:m:s")}</td>
        </tr>)
    }) : (<tr>
        <td className="no-data-row" colSpan={3}>No hay clientes registrados</td>
    </tr>);

    return (
        <div className="row">
            <div className="col-12 mb-3">
                <button onClick={(e)=>{props.setEditMode()}} className="btn btn-sm btn-primary">
                    Nuevo cliente
                    <i className="bi-plus"/>
                </button>
            </div>
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        <div className="input-group mb-3">
                            <span className="input-group-text bg-main">
                                <i className="bi-search"></i>
                            </span>
                            <input onChange={(e)=>props.filterCustomers(e)} type="text" className="form-control" placeholder="Buscar cliente"/>
                        </div>
                    </div>
                </div>
                <table className="table table-stripped table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Razon Social</th>
                        <th>Telefono</th>
                        <th>Ultima visita</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

class CustomersView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {customers: this.props.customers, editing: false, selectedCustomer: undefined, cardTitle: "Clientes"}
    }

    setEditMode = (selectedCustomer, index) => {
        this.setState((state) => {
            return {
                editing: true,
                selectedCustomer: selectedCustomer? selectedCustomer : {},
                cardTitle: "Editar cliente"
            };
        });
    }

    updateCustomer = (e, name) => {
        this.setState((state)=>{
            state.selectedCustomer[name] = e;
            return state;
        })
    }

    deleteCustomer = () => {
        Swal.fire({
            title: '¿Estas seguro?',
            text: "No podras revertir esta accion",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("/api/v0/customers/"+this.state.selectedCustomer.id, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                }).then((response) => {
                    return response.json();
                }).then((data) => {
                    if(data.success){
                        this.setState({editing: false, selectedCustomer: undefined, cardTitle: "Clientes"});
                        this.props.loadCustomers();
                        Swal.fire(
                            'Eliminado!',
                            'El cliente ha sido eliminado',
                            'success'
                        )
                    }
                }).catch((error) => {
                    console.log(error);
                });
            }
        })
    }

    whatToDisplay() {
        switch (this.state.cardTitle) {
            case "Clientes":
                return <ExistentCustomersView customers={this.state.customers}
                                              selectedCustomer={this.state.selectedCustomer}
                                              setEditMode={this.setEditMode}
                                              filterCustomers={this.filterCustomers}/>
            case "Editar cliente":
                return <CustomerEditor onDelete={this.deleteCustomer} onSave={this.onCustomerSave} 
                                       onFormChangeBind={this.updateCustomer}
                                       customer={this.state.selectedCustomer}/>;
            case "Informacion de cliente":
                return <CustomerInfo selectedCustomer={this.state.selectedCustomer}/>;
            default:
                break;
        }
    }

    onCustomerSave = () => {
        let updateCustomer = this.state.selectedCustomer.id?`/${this.state.selectedCustomer.id}`:"";
        fetch("/api/v0/customers" + updateCustomer, {
            method: updateCustomer!==""?"PUT":"POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(this.state.selectedCustomer)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            if(data.success){
                this.setState((state)=>{
                    state.cardTitle = "Clientes";
                    state.editing = false;
                    return state;
                });
                this.props.loadCustomers();
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    filterCustomers = (e) => {
        let customers = this.props.customers.filter((c) => {
            return c.fullName.toLowerCase().includes(e.target.value.toLowerCase());
        });
        this.setState({customers: customers});
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Clientes</h3>
                                {this.state.cardTitle}
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-12">
                                        {this.whatToDisplay()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CustomersView;