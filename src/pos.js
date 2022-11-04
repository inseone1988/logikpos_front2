import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'moment/locale/es-mx';
import moment from 'moment';
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';

import SellViewport from "./SellViewport";
import CustomersView from './customers';
import ProductEdition from "./productedition";
import ProvidersDisplay from "./providerEdition";
import UsersView from "./users";

import logo from './text10.png';

moment.locale('es-mx');

class Clock extends React.Component {

    constructor(props) {
        super(props);
        this.state = { currentTime: undefined };
    }

    componentDidMount() {
        moment.locale = "es-mx";
        this.tick();
    }

    tick() {
        setInterval(() => {
            this.setState({ currentTime: moment().format("dddd DD MMMM YYYY hh:mm:ss") });
        }, 1000);
    }

    render() {
        return (
            <p>{this.state.currentTime}</p>
        );
    }

}

function NavBar(props) {
    return (
        <nav className="navbar bg-light">
            <div className="container-fluid">
                <a href={"#"} className="navbar-brand">
                    <img className='img-fluid' style={{maxWidth:"100px"}} src={logo} alt="logo" />
                </a>
                <ul className="nav justify-content-end text-center">
                        <li className="nav-item me-3 mt-1 fw-bold">
                            <Clock />
                        </li>
                        <li className={"nav-item"}>
                            {props.user ? props.user.Client.fullName : "Invitado"}
                            <button onClick={props.logout} className="ms-2 btn btn-light">
                                <i className="bi-box-arrow-right" />
                            </button>
                        </li>
                    </ul>
            </div>
        </nav>
    );
}

function SideBar(props) {
    return (
        <div className="row d-flex justify-content-center">
            <div className="col-12 logo-image">
            </div>
            <div className="list-group mt-3">
                <button onClick={() => {
                    props.itemClick("venta")
                }} className="list-group-item list-group-item-action">
                    <i className="bi-shop mr-3"></i>
                    &nbsp;Venta
                </button>
                {(() => {
                    if (props.user.role === "CLIENT" || props.user.permissions.products) {
                        return <button onClick={() => {
                            props.itemClick("productos")
                        }} className="list-group-item list-group-item-action">
                            <i className="bi-box mr-3"></i>
                            &nbsp;Productos
                        </button>
                    }
                })()}
                {(()=>{
                    if(props.user.role === "CLIENT" || props.user.permissions.providers){
                        return <button onClick={() => {
                            props.itemClick("provedores")
                        }} className="list-group-item list-group-item-action">
                            <i className="bi-truck mr-3"></i>
                            &nbsp;Proveedores
                        </button>
                    }
                })()}
                {(() => {
                    if (props.user.role === "CLIENT" || props.user.permissions.customers) {
                        return <button onClick={() => {
                            props.itemClick("clientes")
                        }} className="list-group-item list-group-item-action">
                            <i className="bi-people mr-3"></i>
                            &nbsp;Clientes
                        </button>
                    }
                })()}
                {(()=>{
                    if(props.user.role === "CLIENT" || props.user.permissions.users){
                        return <button onClick={() => {
                            props.itemClick("usuarios")
                        }} className="list-group-item list-group-item-action">
                            <i className="bi-person-lines-fill mr-3"></i>
                            &nbsp;Usuarios
                        </button>
                    }
                })()}
                {(()=>{
                    if(props.user.role === "CLIENT" || props.user.permissions.reports){
                        return <button onClick={() => {
                            props.itemClick("reporteria")
                        }} className="list-group-item list-group-item-action">
                            <i className="bi-bar-chart-line mr-3"></i>
                            &nbsp;Reporteria
                        </button>
                    }
                })()}
                {(()=>{
                    if(props.user.role === "CLIENT" || props.user.permissions.config){
                        return <button onClick={() => {
                            props.itemClick("configuracion")
                        }} className="list-group-item list-group-item-action">
                            <i className="bi-gear-fill mr-3"></i>
                            &nbsp;Configuracion
                        </button>
                    }
                })()}
            </div>
        </div>
    );
}

function MainContent(props) {

    const whatToDisplay = () => {
        switch (props.currentview) {
            case "venta":
                return <SellViewport loadProducts={props.loadProducts} products={props.products} />
            case "productos":
                return <ProductEdition loadProducts={props.loadProducts} products={props.products} />
            case "provedores":
                return <ProvidersDisplay loadProviders={props.loadProviders} providers={props.providers} />
            case "clientes":
                return <CustomersView customers={props.customers} loadCustomers={props.loadCustomers} />
            case "reporteria":
                Swal.fire(';) Work in progress...', 'Preparate para las nuevas sorpresas. Pronto.', "info");
                return <SellViewport />
            case "usuarios":
                return <UsersView users={props.users} loadUsers={props.loadUsers}/>
            default:
                break;
        }
    }

    return (
        <div className="row">
            <div className="col-2">
                <SideBar user={props.user} itemClick={props.itemClick} />
            </div>
            <div className="col-10 mt-3">
                {whatToDisplay()}
            </div>
        </div>
    );
}

class POS extends React.Component {

    constructor(props) {
        super(props);
        this.state = {products:[],customers:[],providers:[],users:[], user: this.props.user, currentview: "venta" };
    }

    changeContext = (view) => {
        console.log(view);
        this.setState({ currentview: view });
    }

    componentDidMount() {
        this.loadProducts();
        this.loadProviders();
        this.loadCustomers();
        this.loadUsers();
    }

    loadProducts = () => {
        fetch("api/v0/products/all", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => { return response.json() }
        ).then((data) => {
            if (data.success) {
                this.setState({ products: data.payload });
            }
        });
    }

    loadProviders = () => {
        fetch("api/v0/providers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => { return response.json() }
        ).then((data) => {
            if (data.success) {
                this.setState({ providers: data.payload });
            }
        });
    }

    loadCustomers=()=>{
        fetch("api/v0/customers", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => { return response.json() }
        ).then((data) => {
            if (data.success) {
                this.setState({ customers: data.payload });
            }
        });
    }

    loadUsers = ()=>{
        fetch("api/v0/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => { return response.json() }
        ).then((data) => {
            if (data.success) {
                this.setState({ users: data.payload });
            }
        });
    }

    logout() {
        fetch("api/v0/users/logout", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then((response) => { return response.json() }
        ).then((data) => {
            if (data.success) {
                window.location.reload();
            }
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <NavBar logout={this.logout} user={this.state.user} />
                <MainContent users={this.state.users} loadUsers={this.loadUsers} customers={this.state.customers} loadCustomers={this.loadCustomers} providers={this.state.providers} loadProviders={this.loadProviders} user={this.props.user} loadProducts={this.loadProducts} products={this.state.products} itemClick={this.changeContext} currentview={this.state.currentview} />
            </div>
        );
    }
}

export default POS;