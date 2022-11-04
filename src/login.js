import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import $ from 'jquery';
import Registration from "./registration";
import POS from "./pos";
import logo from './text10.png';


class Login extends React.Component {

    username = "";
    password = "";

    constructor(props, context) {
        super(props, context);
        this.state = {error: false, message: ""};
    }

    fieldUpdate = (name, value) => {
        this[name] = value;
    }

    login = () => {
        if (this.username === "" || this.password === "") {
            return this.setState({
                error: true,
                type: "alert-danger",
                message: "Error: Usuario y contraseña obligatorios"
            });
        }
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.username,
                password: this.password
            })
        }).then(response => response.json())
            .then((r) => {
                if (!r.success) {
                    this.setState({error: true, message: r.message});
                }
                if (r.success) {
                    this.props.onLogin(r.user);
                }
            });
    }

    render() {
        return (<div className="container-fluid login-container">
            <div className="card m-auto login-card">
                <img src={logo} className="card-img-top ps-2 pe-2 pt-3" alt="LogikPOS"/>
                <div className="card-body login-card">
                    <div id='message'
                         className={`alert text-center ${this.state.error ? "" : "d-none"} ${this.state.error ? this.state.type : 'alert-success'}`}>{this.state.message}</div>
                    <div className="row">
                        <div className="form-group">
                            <label className="form-label">Usuario</label>
                            <input onChange={(e) => {
                                this.fieldUpdate(e.target.name, e.target.value)
                            }} id='user' name='username' type="text" className="form-control"/>
                        </div>
                        <div className="form-group mb-3">
                            <label className="form-label">Contraseña</label>
                            <input onChange={(e) => this.fieldUpdate(e.target.name, e.target.value)} id='password'
                                   name='password' type="password" className="form-control"/>
                        </div>
                        <p>¿Aun no tienes cuenta? <button onClick={this.props.displayRegistrationForm}
                                                          className="btn btn-link">Crea un aqui</button></p>
                        <button onClick={this.login} className="btn btn-primary mb-3" type='button'>Salir</button>
                    </div>
                </div>
                <div className="card-footer text-center">
                    Vialogik, 2022
                </div>
            </div>
        </div>)
    }

}


class AuthenticationAndRegister extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.checkSession();
        this.state = {view: "", message: 'Everything is fine', type: "alert-danger", error: false};
    }

    async checkSession() {
        fetch('/session').then(response => response.json())
            .then((r) => {
                if (r.success) {
                    return this.setState({user: r.user, view: "dash"});
                }
                if(!r.success) {
                    this.setState({view: "login"});
                }
            });
    }


    whatToDisplay() {
        switch (this.state.view) {
            case "login":
                return <Login onLogin={(user) => this.setState({user: user, view: "dash"})}
                              displayRegistrationForm={this.displayRegistrationForm}/>
            case "register":
                return <Registration/>
            case "dash":
                return <POS user={this.state.user}/>
        }
    }

    displayRegistrationForm = () => {
        this.setState({view: "register"});
    }

    render() {
        return this.whatToDisplay();
    }
}

export default AuthenticationAndRegister;