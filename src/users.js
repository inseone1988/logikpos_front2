import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

function UserEditor(props) {
    return(
        <div className="row">
            <div className="col-6">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Nombre</label>
                    <input name={"name"} type="text" className="form-control"/>
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Usuario</label>
                    <input name={"username"} type="text" className="form-control"/>
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Contraseña</label>
                    <input name={"password"} type="text" className="form-control"/>
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Rol</label>
                    <select defaultValue={"user"} className={"form-select"} name="role" id="">
                        <option value="admin">Administrador</option>
                        <option value="user">Usuario estandar</option>
                    </select>
                </div>
            </div>
            <div className="col-sm-12 col-md-2 mb-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Status</label>
                    <select name="status" id="" className="form-select">
                        <option value="active">Activo</option>
                        <option value="disabled">Inactivo</option>
                    </select>
                </div>
            </div>
            <div className="col-12 mb-3">
                <div className="card">
                    <div className="card-header">
                        <h6>Permisos</h6>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-12">
                                <select multiple={true} name="permisions" id="" className="form-select">
                                    <option value="p">Editar productos</option>
                                    <option value="c">Editar clientes</option>
                                    <option value="r">Ver reporteria</option>
                                    <option value="v">Editar Proveedores</option>
                                    <option value="f">Editar configuracion</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <button className="btn btn-sm btn-primary">Guardar</button>
                </div>
            </div>
        </div>
    );
}

function UsersListing(props) {

    const rows = props.users ? props.users.map((e, i) => {
        return <tr>
            <td>{e.username}</td>
            <td>{e.role}</td>
            <td>{e.status}</td>
            <td>{e.name}</td>
        </tr>
    }) : (
        <tr>
            <td colSpan={4} className={"no-data-row"}>Agrega usuarios y otorgales permisos</td>
        </tr>)

    return (
        <div className="row">
            <div className="col-12">
                <table className="table table-sm table-bordered table-stripped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Usuario</th>
                            <th>rol</th>
                            <th>status</th>
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


function Card(props) {
    return (
        <div className="card">
            <div className="card-header">
                <h6>{props.title}</h6>
                <div className="row">
                    <div className="col-12">
                        <button disabled={props.editing} onClick={props.editUser} className={`btn btn-sm btn-primary ${props.editing?"d-none":""}`}>Agregar usuario <i className="bi-plus"></i></button>
                    </div>
                </div>
            </div>
            <div className="card-body">
                {props.content()}
            </div>
        </div>
    );
}

class UsersView extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.state = {selectedUser: undefined, editing: false, cardTitle: "Usuarios", users: undefined};
    }

    whatToDisplay = () => {
        switch (this.state.cardTitle) {
            case "Usuarios":
                return <UsersListing />
            case "Edicion de usuario":
                return <UserEditor selectedUser={this.state.selectedUser}/>
        }
    }

    updateUser = (field,value)=>{
        this.state.selectedUser[field] = value;
        this.setState({selectedUser:this.status.selectedUser});
    }

    editUserCallback = ()=>{
        this.setState({editing:true,cardTitle:"Edicion de usuario"});
    }

    render() {
        return (
            <div className="container">
                <Card editing={this.state.editing} editUser={this.editUserCallback} content={this.whatToDisplay} title={this.state.cardTitle} />
            </div>
        );
    }
}

export default UsersView;