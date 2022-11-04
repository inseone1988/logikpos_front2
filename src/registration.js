import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import $ from 'jquery';

function ThanksView(props) {

    function ifError(){
        if (props.error){
            return (
                <div className="col-12">
                    <h3 className={"text-danger"}>:( Oops... Ha ocurrido un error</h3>
                    <p>Nuestros sistemas han detectado una actividad inusual y no podemos continuar con tu registro, te recomendamos intentar con otra informacion o comunicarte con nuestro soporte. Lamentamos el inconveniente.</p>
                    <p>Codigo de error : {props.message}</p>
                </div>
            );
        }
        return (
            <div className="row">
                <div className="col-12">
                    <h3>Gracias :). Solo un paso mas</h3>
                    <p>Te acabamos de enviar un correo de confirmacion para poder acceder a tu cuenta, ingresa y da click en el enlace. Una vez
                        hecho esto podras acceder a todas las funciones de la plataforma gratis por 30 dias</p>
                </div>
            </div>
        );
    }

    return ifError();

}

function BussinessDataCapture(props) {
    return (
        <div className="row mb-3">
            <h5>Datos del negocio</h5>
            <form id={"bdata"}>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Nombre del negocio</label>
                    <input name={"name"} type="text" className="form-control"/>
                </div>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Direccion*:</label>
                    <input name={"baddress"} type="text" className="form-control"/>
                </div>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Telefono*:</label>
                    <input name={"phone"} type="text" className="form-control"/>
                </div>
            </form>
        </div>
    );
}


function UserDataCapture(props) {
    return (
        <div className="row mb-3">
            <form id={"userdata"}>
                <h5>Datos personales</h5>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Nombre*:</label>
                    <input name={"name"} type="text" className="form-control"/>
                </div>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Apellidos*:</label>
                    <input name={"lastName"} type="text" className="form-control"/>
                </div>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Correo electronico*:</label>
                    <input name={"email"} type="text" className="form-control"/>
                </div>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Telefono*:</label>
                    <input name={"phone"} type="text" className="form-control"/>
                </div>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Usuario*:</label>
                    <input name={"userName"} type="text" className="form-control"/>
                </div>
                <div className="col-12">
                    <label htmlFor="" className="form-label">Contraseña*:</label>
                    <input name={"password"} type="password" className="form-control"/>
                </div>
            </form>

        </div>
    );
}

class Registration extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {stage: 1, userData: {},validated : false};
    }

    serializeData(form) {
        let formvalues = $(form).serializeArray();
        let values = {};
        $.map(formvalues, (e, i) => {
            values[e.name] = e.value;
        })
        return values;
    }

    whatToDisplay() {
        switch (this.state.stage) {
            case 1:
                return (<UserDataCapture/>);
            case 2:
                return (<BussinessDataCapture/>);
            case 3:
                return <ThanksView error={this.state.error} message={this.state.message}/>
            default:
                return <UserDataCapture/>
        }
    }

    validateStage() {
        switch (1) {
            case 1 :
                let values = this.serializeData("#userdata");
                console.log(values);
                let keys = Object.keys(values);
                for (const key of keys) {
                    if (values[key] === "") {
                        return "Todos los campos son obligatorios";
                    }
                }
                return false;
            case 2:
                let nValues = this.serializeData("#bdata");
                let nKeys = Object.keys(nValues);
                for (const nKey of nKeys) {
                    if (nValues[nKey] === "") {
                        return "Todos los datos son obligatorios";
                    }
                }
                return false;
            default:
                return true;
        }
    }

    onNextClick = () => {
        //Validate user data
        let validValues = this.validateStage();
        if (!validValues) {
            this.setState({validated: true});
            if (this.state.stage ===1){
                let userDat = this.serializeData("#userdata");
                this.setState({userData:userDat,stage: this.state.stage += 1})
            }
            if (this.state.stage === 2&&this.state.validated) {
                $("#stage2").addClass("registration-step-completed");
                this.state.userData.bussiness = this.serializeData("#bdata");
                console.log(this.state.userData.bussiness);
                $.ajax({
                    url : "/register",
                    type : "post",
                    data : this.state.userData,
                    success: (r)=>{
                        console.log(r);
                        if (!r.success){
                            this.setState({error:true,message:r.message});
                            $("#stage3").addClass("text-danger");
                        }
                        if(r){
                            this.setState({stage: this.state.stage += 1});
                        }

                    }
                })
            }
            if (this.state.stage === 3) {
                $("#stage3").addClass("registration-step-completed");
            }
        }
    }

    endRegistration(){
        window.location.href = "/login";
    }

    render() {
        return (
            <div className="container-fluid login-container">
                <div className="card m-auto login-card">
                    <div className="card-header bg-light">
                        <h5>LogikPOS - Registro</h5>
                    </div>
                    <div className="card-body login-card">
                        <div className="row text-center mb-3">
                            <div className="col-4">
                                <i id={"stage1"} className="registration-step registration-step-completed bi-1-circle"/>
                            </div>
                            <div className="col-4">
                                <i id={"stage2"} className="registration-step bi-2-circle"/>
                            </div>
                            <div className="col-4">
                                <i id={"stage3"} className="registration-step bi-3-circle"/>
                            </div>
                        </div>
                        {this.whatToDisplay()}
                        <div className="row">
                            <div className="col d-flex justify-content-end align-items-end">
                                <button onClick={this.state.stage !==3?this.onNextClick:this.endRegistration} className="btn btn-primary">{this.state.stage !== 3?"Siguiente":"Finalizar"}</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Registration;
