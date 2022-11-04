import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import $ from 'jquery';
import moment from 'moment';
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';

function ProviderEditor(props) {

    const onProviderDataSave = () => {
        let formValues = $("#providerdata").serializeArray();
        const data = {};
        formValues.map((e, i) => {
            data[e.name] = e.value;
        })
        let updateProvider = props.provider ? `/${props.provider.id}` : "";
        console.log(data);
        $.ajax({
            url: "/api/v0/providers" + updateProvider,
            type: (updateProvider!==""?"put":"post"),
            data: data,
            success: (r) => {
                if (r.success) {
                    console.log(r);
                    props.onProviderDataSave(data);
                }
            }
        });
    }

    return (
        <div className="container-fluid">
            <div className="card">
                <div className="card-header">
                    <h5>Edicion de proveedor</h5>
                </div>
                <div className="card-body">
                    <form id="providerdata">
                        <div className="row">
                            <div className="col-12">
                                <label htmlFor="" className="form-label">Nombre* : </label>
                                <input name={"name"} defaultValue={props.provider ? props.provider.name : ""}
                                       type="text"
                                       className="form-control"/>
                            </div>
                            <div className="col-12">
                                <label htmlFor="" className="form-label">Apellidos* : </label>
                                <input name={"last_name"} defaultValue={props.provider ? props.provider.last_name : ""}
                                       type="text"
                                       className="form-control"/>
                            </div>
                            <div className="col">
                                <label htmlFor="social_name" className="form-label">Razon Social* : </label>
                                <input name={"social_name"}
                                       defaultValue={props.provider ? props.provider.social_name : ""} type="text"
                                       className="form-control"/>
                            </div>
                            <div className="col">
                                <label htmlFor="" className="form-label">RFC : </label>
                                <input type="text" className="form-control"/>
                            </div>
                            <div className="col mb-3">
                                <label htmlFor="" className="form-label">Direccion : </label>
                                <input type="text" className="form-control"/>
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
                    </form>
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

        const onProviderDelete =()=>{
            Swal.fire({
                title: '¿Eliminar ' + e.social_name + "?",
                text: "Esta accion es irreversible!",
                icon: 'warning',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText : 'Cancelar',
                confirmButtonText: 'Si, eliminalo!'
            }).then((result) => {
                if (result.isConfirmed) {
                    $.ajax({
                        url : '/api/v0/providers/'+ e.id,
                        type:'delete',
                        success : (r)=>{
                            if (r.success){
                                const nList = props.providers.filter((item)=>item.id !==e.id)
                                props.onProviderDeleted(nList);
                            }
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

    function filterProviders(e){
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
                                <input onChange={(e)=>filterProviders(e)} type="text" className="form-control"/>
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
        this.state = {providers: this.props.providers,editingProvider: false, selectedProvider: undefined,view:"providerList"};
    }

    editProvider = (provider) => {
        this.setState({editingProvider: true, selectedProvider: provider,view:"providerEdit"});
    }

    providerSavedCallback = (provider) => {
            this.props.loadProviders();
    }

    onProviderEditingCancel = () => {
        this.setState({editingProvider: false, selectedProvider: undefined,view:"providerList"});
    }

    createNewProvider = () => {
        this.setState({editingProvider: true,view:"providerEdit"});
    }

    onProviderDeleted = (providers)=>{
        this.setState({providers:providers});
    }

    onProviderFilter = (providers)=>{
        this.setState({providers:providers.length?providers:this.props.providers});
    }

    whatToDisplay() {
        switch (this.state.view) {
            case "providerList":
                return <ExistentProvidersDisplay onProviderFilter={this.onProviderFilter} onProviderDeleted={this.onProviderDeleted} providers={this.state.providers} onProviderSelect={this.editProvider} createNewProviderCallback={this.createNewProvider}/>
            case "providerEdit":
                return <ProviderEditor onProviderDataSave={this.providerSavedCallback} onProviderEditingCancel={this.onProviderEditingCancel} provider={this.state.selectedProvider}/>
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