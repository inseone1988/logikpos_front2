import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';
import Swal from "sweetalert2";
import handler from "./handler";

function UserEditor(props) {

    function mapPermissions() {
        const permissions = props.selectedUser.permissions;
        const permissionsMap = [];
        if (props.selectedUser.id) {
            if (permissions.users) permissionsMap.push("u");
            if (permissions.products) permissionsMap.push("p");
            if (permissions.clients) permissionsMap.push("c");
            if (permissions.vendors) permissionsMap.push("v");
            if (permissions.reports) permissionsMap.push("r");
            if (permissions.config) permissionsMap.push("f");
        }
        return permissionsMap;
    }

    return (
        <div className="row">
            <div className="col-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Nombre</label>
                    <input defaultValue={props.selectedUser.id ? props.selectedUser.Client.name : ""}
                           onChange={(e) => props.onUpdateUser(e.target.name, e.target.value)} name={"name"} type="text"
                           className="form-control"/>
                </div>
            </div>
            <div className="col-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Apellido</label>
                    <input defaultValue={props.selectedUser.id ? props.selectedUser.Client.lastName : ""}
                           onChange={(e) => props.onUpdateUser(e.target.name, e.target.value)} name={"lastName"}
                           type="text" className="form-control"/>
                </div>
            </div>
            <div className="col-6">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Email</label>
                    <input defaultValue={props.selectedUser.id ? props.selectedUser.Client.email : ""}
                           onChange={(e) => props.onUpdateUser(e.target.name, e.target.value)} name={"email"}
                           type="text" className="form-control"/>
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Usuario</label>
                    <input defaultValue={props.selectedUser.id ? props.selectedUser.userName : ""}
                           onChange={(e) => props.onUpdateUser(e.target.name, e.target.value)} name={"userName"}
                           type="text" className="form-control"/>
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Contraseña</label>
                    <input onChange={(e) => props.onUpdateUser(e.target.name, e.target.value)} name={"password"}
                           type="text" className="form-control"/>
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Rol</label>
                    <select onChange={(e) => props.onUpdateUser(e.target.name, e.target.value)} defaultValue={"user"}
                            className={"form-select"} name="role" id="">

                        <option value="USER">Usuario estandar</option>
                    </select>
                </div>
            </div>
            <div className="col-sm-12 col-md-2 mb-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Status</label>
                    <select defaultValue={props.selectedUser.id ? props.selectedUser.active : ""}
                            onChange={(e) => props.onUpdateUser(e.target.name, e.target.value)} name="active" id=""
                            className="form-select">
                        <option value="true">Activo</option>
                        <option value="false">Inactivo</option>
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
                                <select defaultValue={mapPermissions()}
                                        onChange={(e) => props.onUpdateUser(e.target.name, e.target.value, e)}
                                        multiple={true} size={6} name="permissions" id="" className="form-select">
                                    <option value="p">Editar productos</option>
                                    <option value="c">Editar clientes</option>
                                    <option value="v">Editar Proveedores</option>
                                    <option value="u">Editar usuarios</option>
                                    <option value="r">Ver reporteria</option>
                                    <option value="f">Editar configuracion</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <button onClick={() => props.onDeleteUser()}
                            className={`btn btn-sm btn-danger me-3 ${props.selectedUser.id ? "" : "d-none"}`}>Eliminar
                    </button>
                    <button onClick={() => props.onSaveUser()} className="btn btn-sm btn-primary">Guardar</button>
                </div>
            </div>
        </div>
    );
}

function UsersListing(props) {

    const rows = props.users.length ? props.users.map((user, i) => {
        return <tr key={i} onDoubleClick={(e) => props.onUserSelected(user, i)}>
            <td>{user.Client.fullName}</td>
            <td>{user.userName}</td>
            <td>{user.role}</td>
            <td>{user.active}</td>
        </tr>
    }) : (
        <tr>
            <td colSpan={4} className={"no-data-row"}>Agrega usuarios y otorgales permisos</td>
        </tr>)

    return (
        <div className="row">
            <div className="col-12">
                <div className="row">
                    <div className="col-12">
                        <div className="input-group mb-3">
                            <span className="input-group-text">
                                <i className="bi-search"></i>
                            </span>
                            <input onChange={props.filterUsers} type="text" className="form-control"
                                   placeholder="Buscar usuario"/>
                        </div>
                    </div>
                </div>
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
                        <button disabled={props.editing}
                                onClick={() => props.editUser(props.selectedUser ? props.selectedUser : {})}
                                className={`btn btn-sm btn-primary ${props.editing ? "d-none" : ""}`}>Agregar usuario <i
                            className="bi-plus"></i></button>
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

    constructor(props) {
        super(props);
        this.state = {users: this.props.users, selectedUser: undefined, editing: false, cardTitle: "Usuarios"};
    }

    whatToDisplay = () => {
        switch (this.state.cardTitle) {
            case "Usuarios":
                return <UsersListing filterUsers={this.filterUsers} users={this.props.users}
                                     onUserSelected={this.editUserCallback}/>
            case "Edicion de usuario":
                return <UserEditor onDeleteUser={this.delteUser} onUpdateUser={this.updateUser}
                                   onSaveUser={this.saveUser}
                                   selectedUser={this.state.selectedUser}/>
        }
    }

    updateUser = (field, value, e) => {
        this.setState((state) => {
            if (field === "userName" || field === "password" || field === "role" || field === "active" || field === "permissions") {
                if (!state.selectedUser.User) state.selectedUser.User = {};
                if (field === "permissions") {
                    let p = {};
                    let sOpts = e.target.selectedOptions;
                    for (const permision of sOpts) {
                        switch (permision.value) {
                            case "p":
                                p["products"] = true;
                                break;
                            case "c":
                                p["clients"] = true;
                                break;
                            case "r":
                                p["reports"] = true;
                                break;
                            case "v":
                                p["vendors"] = true;
                                break;
                            case "f":
                                p["config"] = true;
                                break;
                            case "u":
                                p["users"] = true;
                                break;
                            default:
                                break;
                        }
                    }
                    state.selectedUser.User[field] = p;
                    return state;
                }
                state.selectedUser.User[field] = value;
                return state;
            }
            state.selectedUser[field] = value;
            return state;
        });

    }

    loadUsers = () => {
        this.props.loadUsers();
    }

    saveUser = () => {
        if (this.state.selectedUser.id) {
            handler.updateUser(this.state.selectedUser)
                .then((res) => {
                    console.log('data',res.payload);
                    Swal.fire({
                        title: 'Usuario actualizado',
                        text: `El usuario se actualizo correctamente`,
                        icon: 'success',
                        confirmButtonText: 'Ok',
                        timer: 2000
                    }).then(() => {
                        this.loadUsers();
                        this.setState({cardTitle: "Usuarios", selectedUser: undefined, editing: false});
                    })
                })
        } else {
            handler.createUser(this.state.selectedUser)
                .then((res) => {
                    if (res.success) {
                        Swal.fire({
                            title: 'Usuario creado',
                            text: "El usuario se creo correctamente",
                            icon: 'success',
                            confirmButtonText: 'Ok',
                            timer: 2000
                        }).then(() => {
                            this.loadUsers();
                            this.setState({cardTitle: "Usuarios", selectedUser: undefined, editing: false});
                        })
                    }else{
                        Swal.fire({
                            title: 'Error',
                            text: res.message,
                            icon: 'error',
                            confirmButtonText: 'Ok',
                            timer: 2000
                        })
                    }
                })
        }
    }

    delteUser = () => {
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
                handler.deleteUser(this.state.selectedUser.id)
                    .then((res) => {
                        if (res.success) {
                            Swal.fire({
                                title: 'Usuario eliminado',
                                text: "El usuario se elimino correctamente",
                                icon: 'success',
                                confirmButtonText: 'Ok',
                                timer: 2000
                            }).then(() => {
                                this.loadUsers();
                                this.setState({cardTitle: "Usuarios", selectedUser: undefined, editing: false});
                            })
                        }

                    })
            }
        })
    }

    editUserCallback = (selectedUser, index) => {
        console.log(selectedUser);
        this.setState({editing: true, cardTitle: "Edicion de usuario", selectedUser: selectedUser});
    }

    filterUsers = (e) => {
        let filter = e.target.value;
        let users = this.props.users.filter((user) => {
            return user.Client.fullName.toLowerCase().includes(filter.toLowerCase()) || user.userName.toLowerCase().includes(filter.toLowerCase());
        });
        this.setState({users: users});
    }

    render() {
        return (
            <div className="container">
                <Card editing={this.state.editing} editUser={this.editUserCallback} content={this.whatToDisplay}
                      title={this.state.cardTitle}/>
            </div>
        );
    }
}

export default UsersView;