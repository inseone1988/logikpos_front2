const react = require('react');

const numeral = require('numeral');
const Swal = require('sweetalert2');
const handler = require('./handler');

class MoneyCount extends react.Component {
    constructor(props) {
        super(props);
        this.state = {cDrawerData: {}, money: 0, view: "resume"};
    }

    sumMoney() {
        let total = 0;
        let inputs = document.getElementsByTagName('input');
        console.log("Here")
        for (let i = 0; i < inputs.length; i++) {
            total += (Number(isNaN(inputs[i].value) ? "0" : inputs[i].value) * Number(inputs[i].name));
        }
        this.setState({money: total});
    }

    resetMoney = () => {
        this.setState({money: 0});
        let inputs = document.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = 0;
        }
    }

    saveMoneyCount = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Estás seguro de que quieres guardar este conteo?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, guardar!'
        }).then((result) => {
            if (result.isConfirmed) {
                let data = {
                    money: this.state.money,
                    cashDrawerId: this.props.cashDrawerId
                };
                handler.saveMoneyCount(data).then((data) => {
                    if (data.success) {
                        Swal.fire(
                            'Guardado!',
                            'El conteo ha sido guardado.',
                            'success'
                        );
                        this.props.onMoneyCounted();
                    } else {
                        Swal.fire(
                            'Error!',
                            'Ha ocurrido un error al guardar el conteo.',
                            'error'
                        );
                    }
                });
            }
        });
    }

    MoneyCount() {
        return (
            <div>
                <h1>Corte de caja</h1>
                <div className="container">
                    <div className="row">
                        <div className="col-md-4 text-center">
                            <h2>Monedas</h2>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-coin">$0.50</i>
                                </span>
                                <input name={"0.5"} onChange={(e) => this.sumMoney(e)}
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-coin">$1.00</i>
                                </span>
                                <input name={"1"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-coin">$2.00</i>
                                </span>
                                <input name={"2"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-coin">$5.00</i>
                                </span>
                                <input name={"5"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-coin">$10.00</i>
                                </span>
                                <input name={"10"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-coin">$20.00</i>
                                </span>
                                <input name={"20"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                        </div>
                        <div className="col-md-4 text-center">
                            <h2>Billetes</h2>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-cash">$20.00</i>
                                </span>
                                <input name={"20"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-cash">$50.00</i>
                                </span>
                                <input name={"50"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-cash">$100.00</i>
                                </span>
                                <input name={"100"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-cash">$200.00</i>
                                </span>
                                <input name={"200"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-cash">$500.00</i>
                                </span>
                                <input name={"500"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                            <div className="input-group mb-3">
                                <span className="input-group-text bg-main">
                                    <i className="bi-cash">$1000.00</i>
                                </span>
                                <input name={"1000"} onChange={(e) => this.sumMoney(e)} type="number"
                                       className="form-control" defaultValue="0"/>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <h2 className="text-center text-blue-800 text-3xl">Total: {numeral(this.state.money).format("$0.00")}</h2>
                        </div>
                        <div className="col-12">
                            <button onClick={this.resetMoney} className="btn btn-danger">Reset</button>
                            <button onClick={this.saveMoneyCount} className="btn btn-primary">Realizar corte de caja
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    ResumeDisplay() {
        return (
            <div className="row">

            </div>
        );
    }

    render() {
        return (
            this.state.view === "moneyCount" ? this.ResumeDisplay() : this.MoneyCount()
        );
    }
}

export default MoneyCount;