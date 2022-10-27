import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import "bootstrap-icons/font/bootstrap-icons.css";
import "moment/dist/locale/es-mx";
import moment from "moment";

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
                    <input defaultValue={props.customer ? props.customer.fname : ""} name="fname"
                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-xxsm-12 col-sm-6 col-md-4">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Apellido materno</label>
                    <input defaultValue={props.customer ? props.customer.lname : ""} name="lname"
                           onChange={(e) => props.onFormChangeBind(e.target.value, e.target.name)} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-xxsm-12 col-sm-6 col-md-4">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Limite de credito</label>
                    <input defaultValue={props.customer ? props.customer.credit : ""} name="credit"
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
            <div className="col-12">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <h5>Datos fiscales (Facturacion)</h5>
                                <div className="form-group">
                                    <label htmlFor="" className="form-label">RFC</label>
                                    <input defaultValue={props.customer ? props.customer.taxid : ""} name="taxid"
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
            <div className="col-12">
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

    const rows = props.customers ? props.customers.map((e, i) => {
        return (<tr key={i} onDoubleClick={() => props.setEditMode(e, i)}>
            <td>{e.name}</td>
            <td>{e.phone}</td>
            <td>{moment(e.updated_at).format("DD MMMM YYYY h:m:s")}</td>
        </tr>)
    }) : (<tr>
        <td className="no-data-row" colSpan={3}>No hay clientes registrados</td>
    </tr>);

    return (
        <div className="row">
            <div className="col-12 mb-3">
                <button onClick={props.setEditMode} className="btn btn-sm btn-primary">
                    Nuevo cliente
                    <i className="bi-plus"/>
                </button>
            </div>
            <div className="col-12">
                <table className="table table-stripped table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>Nombre</th>
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
        this.state = {customers: undefined, editing: false, selectedCustomer: undefined, cardTitle: "Clientes"}
    }

    componentDidMount() {

    }

    setEditMode = (selectedCustomer, index) => {

        console.log(selectedCustomer, index);
        if (selectedCustomer) selectedCustomer.index = index;
        const customerData = {
            name: "",
            lastName: "",
            phone: "",
            email: "",
            address: "",
            fiscalData: {}
        };
        this.setState({
            cardTitle: "Editar cliente",
            editing: true,
            selectedCustomer: selectedCustomer.name ? selectedCustomer : customerData
        });
    }

    updateCustomer = (e, name) => {
        this.state.selectedCustomer[name] = e;
        this.setState({selectedCustomer: this.state.selectedCustomer});
    }

    whatToDisplay() {
        switch (this.state.cardTitle) {
            case "Clientes":
                return <ExistentCustomersView customers={this.state.customers}
                                              selectedCustomer={this.state.selectedCustomer}
                                              setEditMode={this.setEditMode}/>
            case "Editar cliente":
                return <CustomerEditor onSave={this.addcustomerToCollection} onFormChangeBind={this.updateCustomer}
                                       customer={this.state.selectedCustomer}/>;
            case "Informacion de cliente":
                return <CustomerInfo selectedCustomer={this.state.selectedCustomer}/>;
            default:
                break;
        }
    }

    addcustomerToCollection = () => {
        if (!Array.isArray(this.state.customers)) this.state.customers = [];
        this.state.selectedCustomer.updated_at = moment().format();
        if (!this.state.selectedCustomer.index && this.state.selectedCustomer.index !== 0) this.state.customers.push(this.state.selectedCustomer);
        this.setState({
            customers: this.state.customers,
            editing: false,
            selectedCustomer: undefined,
            cardTitle: "Clientes"
        });
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