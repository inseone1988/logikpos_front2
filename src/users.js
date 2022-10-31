import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles.css';

function UserEditor(props) {
    return (
        <div className="row">
            <div className="col-6">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Nombre</label>
                    <input onChange={(e)=>props.onUpdateUser(e.target.name,e.target.value)} name={"name"} type="text" className="form-control" />
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Usuario</label>
                    <input onChange={(e)=>props.onUpdateUser(e.target.name,e.target.value)} name={"userName"} type="text" className="form-control" />
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Contraseña</label>
                    <input onChange={(e)=>props.onUpdateUser(e.target.name,e.target.value)} name={"password"} type="text" className="form-control" />
                </div>
            </div>
            <div className="col-sm-12 col-md-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Rol</label>
                    <select onChange={(e)=>props.onUpdateUser(e.target.name,e.target.value)} defaultValue={"user"} className={"form-select"} name="role" id="">
                    
                        <option value="USER">Usuario estandar</option>
                    </select>
                </div>
            </div>
            <div className="col-sm-12 col-md-2 mb-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Status</label>
                    <select onChange={(e)=>props.onUpdateUser(e.target.name,e.target.value)} name="active" id="" className="form-select">
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
                                <select onChange={(e)=>props.onUpdateUser(e.target.name,e.target.value,e)} multiple={true} name="permisions" id="" className="form-select">
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
                    <button onClick={() => props.onSaveUser()} className="btn btn-sm btn-primary">Guardar</button>
                </div>
            </div>
        </div>
    );
}

function UsersListing(props) {

    const rows = props.users.length ? props.users.map((e, i) => {
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
                        <button disabled={props.editing} onClick={() => props.editUser(props.selectedUser ? props.selectedUser : {})} className={`btn btn-sm btn-primary ${props.editing ? "d-none" : ""}`}>Agregar usuario <i className="bi-plus"></i></button>
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
        this.state = {users:[], selectedUser: undefined, editing: false, cardTitle: "Usuarios"};
    }

    whatToDisplay = () => {
        switch (this.state.cardTitle) {
            case "Usuarios":
                return <UsersListing users={this.state.users} onUserSelected={this.editUserCallback}/>
            case "Edicion de usuario":
                return <UserEditor onUpdateUser={this.updateUser} onSaveUser={this.saveUser} selectedUser={this.state.selectedUser} />
        }
    }

    updateUser = (field, value,e) => {
        this.setState((state) => {
            if(field==="userName"||field==="password"||field==="role"||field==="active"||field==="permisions"){
                if(!state.selectedUser.User) state.selectedUser.User = {};
                if(field === "permisions"){
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
                                p["report"] = true;
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
        fetch("api/v0/users")
            .then(res => res.json())
            .then((result) => {
                if (result.success) {
                    this.setState({users: result.payload});
                }
            });
    }

    saveUser = () => {
        fetch("api/v0/users", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.selectedUser)
        }).then((res) => res.json())
        .then((r)=>{
            if(r.success){
                this.setState({selectedUser: undefined, editing: false, cardTitle: "Usuarios"});
                this.loadUsers();
            }
        }).catch((err) => {
            console.log(err);
        });
        console.log(this.state.selectedUser);
        this.setState((state)=>{
            state.editing = false;
            state.cardTitle = "Usuarios";
            if(state.selectedUser.id){
                state.users = state.users.map((e,i)=>{
                    if(e.id===state.selectedUser.id) return state.selectedUser;
                    return e;
                });
            }else{
                state.users.push(state.selectedUser);
            }
            return state;
        });
    }

    editUserCallback = (selectedUser) => {
        this.setState({ editing: true, cardTitle: "Edicion de usuario", selectedUser: selectedUser });
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