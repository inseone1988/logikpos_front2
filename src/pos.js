import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import $ from 'jquery';
import 'moment/dist/locale/es-mx';
import moment from 'moment/';
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';

import SellViewport from "./SellViewport";
import CustomersView from './customers';
import ProductEdition from "./productedition";
import ProvidersDisplay from "./providerEdition";
import UsersView from "./users";

class Clock extends React.Component {

    constructor(props, context) {
        super(props, context);
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
                <a href={"#"} className="navbar-brand">LogikPOS</a>
                <div className="d-flex">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
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
                <button onClick={() => {
                    props.itemClick("productos")
                }} className="list-group-item list-group-item-action">
                    <i className="bi-box mr-3"></i>
                    &nbsp;Productos
                </button>
                <button onClick={() => {
                    props.itemClick("provedores")
                }} className="list-group-item list-group-item-action">
                    <i className="bi-truck mr-3"></i>
                    &nbsp;Proveedores
                </button>
                <button onClick={() => {
                    props.itemClick("clientes")
                }} className="list-group-item list-group-item-action">
                    <i className="bi-people mr-3"></i>
                    &nbsp;
                    Clientes
                </button>
                <button onClick={()=>props.itemClick("reporteria")} className="list-group-item list-group-item-action">
                    <i className="bi-bar-chart-line mr-3"></i>&nbsp;
                    Reporteria
                </button>
                <button onClick={()=>props.itemClick("usuarios")} className="list-group-item list-group-item-action">
                    <i className="bi-person-lines-fill mr-3"></i>&nbsp;
                    Usuarios
                </button>
                <button onClick={()=>props.itemClick("configuration")} className="list-group-item list-group-item-action">
                    <i className="bi-gear-fill mr-3"></i>&nbsp;
                    Configuracion
                </button>
            </div>
        </div>
    );
}

function MainContent(props) {

    const whatToDisplay = () => {
        switch (props.currentview) {
            case "venta":
                return <SellViewport products={props.products} />
            case "productos":
                return <ProductEdition loadProducts={props.loadProducts} products={props.products} />
            case "provedores":
                return <ProvidersDisplay />
            case "clientes":
                return <CustomersView />
            case "reporteria":
                Swal.fire(';) Work in progress...','Preparate para las nuevas sorpresas. Pronto.',"info");
                return <SellViewport />
            case "usuarios":
                return <UsersView />
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

    constructor(props, context) {
        super(props, context);
        this.state = {user:this.props.user, currentview: "venta"};
    }

    changeContext = (view) => {
        console.log(view);
        this.setState({ currentview: view });
    }

    componentDidMount() {
        this.loadProducts();
    }

    loadProducts = () => {
        fetch("api/v0/products/all",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response)=>{return response.json()}
        ).then((data)=>{
            if(data.success){
                this.setState({products:data.payload});
            }
        });
    }

    logout (){
        fetch("api/v0/users/logout",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        }).then((response)=>{return response.json()}
        ).then((data)=>{
            if(data.success){
                window.location.reload();
            }
        });
    }

    render() {
        return (
            <div className="container-fluid">
                <NavBar logout={this.logout} user={this.state.user} />
                <MainContent loadProducts={this.loadProducts} products={this.state.products} itemClick={this.changeContext} currentview={this.state.currentview} />
            </div>
        );
    }
}

export default POS;