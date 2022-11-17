import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';
import handler from './handler';

function ProviderEditor(props) {

    const [provider, setProvider] = useState(props.provider);

    const onProviderDataSave = () => {
        if (provider.id) {
            handler.updateProvider(provider).then((r) => {
                if (r.success) {
                    Swal.fire({
                        title: 'Exito!',
                        text: 'Se ha actualizado el proveedor',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((r) => {
                        props.onProviderDataSave();
                    })
                }
            })
        }else {
            handler.createProvider(provider).then((r) => {
                if (r.success) {
                    Swal.fire({
                        title: 'Exito!',
                        text: 'Se ha creado el proveedor',
                        icon: 'success',
                        confirmButtonText: 'Ok'
                    }).then((r) => {
                        props.onProviderDataSave();
                    })
                }
            })
        }
    }

    function inputChange(e) {
        const name = e.target.name;
        provider[name] = e.target.value;
        setProvider(provider);
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <h5>Edicion de proveedor</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-12">
                            <label htmlFor="" className="form-label">Nombre* : </label>
                            <input onChange={(e)=>inputChange(e)} name={"name"} defaultValue={props.provider ? props.provider.name : ""}
                                   type="text"
                                   className="form-control"/>
                        </div>
                        <div className="col-12">
                            <label htmlFor="" className="form-label">Apellidos* : </label>
                            <input onChange={(e)=>inputChange(e)} name={"last_name"} defaultValue={props.provider ? props.provider.last_name : ""}
                                   type="text"
                                   className="form-control"/>
                        </div>
                        <div className="col">
                            <label htmlFor="social_name" className="form-label">Razon Social* : </label>
                            <input onChange={(e)=>inputChange(e)} name={"social_name"}
                                   defaultValue={props.provider ? props.provider.social_name : ""} type="text"
                                   className="form-control"/>
                        </div>
                        <div className="col">
                            <label htmlFor="" className="form-label">RFC : </label>
                            <input onChange={(e)=>inputChange(e)} type="text" className="form-control"/>
                        </div>
                        <div className="col mb-3">
                            <label htmlFor="" className="form-label">Direccion : </label>
                            <input onChange={(e)=>inputChange(e)} type="text" className="form-control"/>
                        </div>
                        <div className="col-12 d-flex justify-content-end align-items-end">
                            <button onClick={props.onProviderEditingCancel} type={"button"}
                                    className="btn btn-danger me-2">Cancelar
                            </button>
                            <button onClick={onProviderDataSave} type={"button"} className="btn btn-primary">Guardar
                                proveedor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

function ExistentProvidersDisplay(props) {

    const providerRows = props.providers.length ? props.providers.map((e, i) => {
        const onEditClick = () => {
            props.onProviderSelect(e);
        }

        const onProviderDelete = () => {
            Swal.fire({
                title: '¿Eliminar ' + e.social_name + "?",
                text: "Esta accion es irreversible!",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: 'Cancelar',
                confirmButtonText: 'Si, eliminalo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    handler.deleteProvider(e.id).then((r) => {
                        if (r.success) {
                            Swal.fire(
                                'Eliminado!',
                                'El proveedor ha sido eliminado.',
                                'success'
                            ).then((r) => {
                                props.loadProviders();
                            })
                        }
                    })
                }
            })
        }

        return (<tr key={e.id}>
            <td>{e.name + " " + e.last_name}</td>
            <td>{e.social_name}</td>
            <td>
                <button onClick={onEditClick} className="btn btn-success me-2 "><i className="bi-pencil"/></button>
                <button onClick={onProviderDelete} className="btn btn-danger"><i className="bi-trash"/></button>
            </td>
        </tr>)
    }) : (<tr>
        <td className="no-data-row" colSpan="3">Para que sepas quien te surte que y a como</td>
    </tr>)

    function filterProviders(e) {
        const filter = e.target.value;
        const filteredProviders = props.providers.filter((e) => {
            return e.name.toLowerCase().includes(filter.toLowerCase()) || e.last_name.toLowerCase().includes(filter.toLowerCase()) || e.social_name.toLowerCase().includes(filter.toLowerCase());
        })
        props.onProviderFilter(filteredProviders);
    }

    return (
        <div className="col">
            <div className="card">
                <div className="card-header">
                    <h5>Proveedores</h5>
                    <button onClick={props.createNewProviderCallback} className="btn btn-primary btn-sm">Nuevo proveedor<i
                        className="bi-plus"/></button>
                </div>
                <div className="card-body">
                    <div className="row mb-3">
                        <div className="col">
                            <div className="input-group mb3">
                                <span className="input-group-text"><i className="bi-search"/></span>
                                <input onChange={(e) => filterProviders(e)} type="text" className="form-control"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <table className="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Razon Social</th>
                                    <th>Acciones</th>
                                </tr>
                                </thead>
                                <tbody>
                                {providerRows}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

class ProvidersDisplay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            providers: this.props.providers,
            editingProvider: false,
            selectedProvider: {name: "", last_name: "", social_name: "", rfc: "", address: ""},
            view: "providerList"
        };
    }

    editProvider = (provider) => {
        this.setState({editingProvider: true, selectedProvider: provider, view: "providerEdit"});
    }

    providerSavedCallback = () => {
        this.props.loadProviders();
        this.setState({editingProvider: false, selectedProvider: {name: "", last_name: "", social_name: "", rfc: "", address: ""}, view: "providerList"});
    }

    onProviderEditingCancel = () => {
        this.setState({editingProvider: false, selectedProvider: undefined, view: "providerList"});
    }

    createNewProvider = () => {
        this.setState({editingProvider: true, view: "providerEdit"});
    }

    onProviderDeleted = (providers) => {
        this.setState({providers: providers, view: "providerList"});
    }

    onProviderFilter = (providers) => {
        this.setState({providers: providers.length ? providers : this.props.providers});
    }

    whatToDisplay() {
        switch (this.state.view) {
            case "providerList":
                return <ExistentProvidersDisplay onProviderFilter={this.onProviderFilter}
                                                 onProviderDeleted={this.onProviderDeleted}
                                                 providers={this.props.providers} onProviderSelect={this.editProvider}
                                                 createNewProviderCallback={this.createNewProvider}/>
            case "providerEdit":
                return <ProviderEditor loadProviders={this.props.loadProviders} onProviderDataSave={this.providerSavedCallback}
                                       onProviderEditingCancel={this.onProviderEditingCancel}
                                       provider={this.state.selectedProvider}/>
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    {this.whatToDisplay()}
                </div>
            </div>
        );
    }
}

export default ProvidersDisplay;