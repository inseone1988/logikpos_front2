import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from "react";
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import numeral from 'numeral';
import Swal from 'sweetalert2';
import '@tarekraafat/autocomplete.js/dist/css/autoComplete.css';
import '@tarekraafat/autocomplete.js/dist/autoComplete';

function ItemPanel(props) {

    function modifyQuantity(element, index, event) {
        Swal.fire({
            title: 'Cantidad',
            text: element.description,
            input: 'number',
            inputValue: element.quantity
        }).then((result) => {
            if (result.isConfirmed) {
                element.quantity = result.value;
                props.modifyQuantity(element, index);
            }
        });
    }

    const rows = props.order.items.length ? props.order.items.map((e, i) => {
        let total = (e.quantity * Number(e.Price.price));
        return (
            <tr key={i}>
                <td>{e.description}</td>
                <td onDoubleClick={(event) => modifyQuantity(e, i, event)}>{e.quantity}</td>
                <td onDoubleClick={() => props.modifyPrice(e, i)}>{numeral(e.Price.price).format("$00.00")}</td>
                <td>{numeral(total).format("$00.00")}</td>
            </tr>
        );
    }) : <tr>
        <td className="no-data-row" colSpan={4}> Agregue un articulo</td>
    </tr>;

    return (
        <div className="row mt-3">
            <div className="col-12 table-wrapper">
                <table className="table table-sm table-bordered">
                    <thead className="text-center text-gray">
                    <tr>
                        <th className="item-desc">Articulo</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th className="item-total">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

function LCDDisplay(props) {
    return (
        <div className="col-sm-12 col-md-4 lcd-display">
            {numeral(props.order.total).format("$0.00")}
        </div>
    );
}

function FolioDisplay(props) {
    return (
        <div className="row">
            <div className="col-12">
                <h4> Folio : {props.folio}</h4>
            </div>
        </div>
    );
}

function CodeCapture(props) {

    function goSearchProduct(string) {
        const result = props.products.filter((element) => {
            return (element.internalCode === string || element.sku === string);
        })
        props.onProductSelected(result);
    }

    function getProduct(element) {
        if (element.keyCode === 13) {
            goSearchProduct(element.target.value);
            element.target.value = "";
            element.target.focus();
        }
    }

    /**
     * Helper methos to populate fake products for testing
     */
    async function createFakeProducts(){
        await fetch('api/v0/products/faketize');
    }

    return (
        <div className="row search-bar-end">
            <div className="col-12">
                <button onClick={createFakeProducts} className="btn btn-sm btn-primary mb-3">Faketize</button>
                <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text">
                        <i className="bi-search"/>
                    </span>
                    <input id={"code"} onKeyUp={getProduct.bind(this)} type="text" className="form-control"
                           placeholder="Captura codigo de producto"/>
                </div>
            </div>
        </div>
    )
}

function SearchBar(props) {
    return (
        <div className="col-sm-12 col-md-8">
            <CodeCapture products={props.products} onProductSelected={props.onProductSelected}/>
        </div>
    );
}

function ButtonBar(props) {
    return (<div className='row'>
        <div className="col-12">
            <div className="btn-group mt-3 mb-2 d-flex align-items-center justify-items-center">
                <button type='button' className='btn btn-outline-info'><i className="bi-plus"></i>IVA</button>
                <button type='button' className='btn btn-outline-info'>Presupuesto</button>
                <button onClick={() => {
                    props.clickCallback("cobrar")
                }} type='button' className='btn btn-primary'>Cobrar
                </button>
                <button type='button' className='btn btn-danger'>Cancelar</button>
            </div>
        </div>
    </div>);
}

function CobrarViewPort(props) {
    return (
        <div className="row">
            <div className="col">
                <h1>Hello world</h1>
            </div>
        </div>
    );
}

function CheckoutView(props){
    return (
        <div className="row">
            <div className="col-auto">
                <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text"><h4>Efectivo <i className="bi-currency-dollar"></i></h4></span>
                    <input autoFocus={true} onKeyUp={(e)=>props.cashInputChange(e)} type="number" step={0.50} className="form-control"/>
                </div>
            </div>
            <div className="col-auto">
                <h3 className={props.change<0?"text-danger":"text-success"}>{`${props.change<0?"Faltan":"Cambio"}: ${numeral(props.change).format("$0.00")}`}</h3>
            </div>
        </div>
    );
}


class UtilsView extends React.Component {


    constructor(props, context) {
        super(props, context);
        this.state = {contextMessage:this.props.message,context:this.props.context,change:0.0};
    }

    updateChange = (event)=>{
        let change = event.target.value - this.props.order.total;
        console.log(event.keyCode);
        this.setState({change:change});
        if (event.keyCode === 13){
            this.props.finalizeOrder({change:change,total:this.props.order.total,cash:event.target.value});
        }
    }

    setContent(){
        switch (this.props.context){
            case "sell":
                return (<h4>Cantidad de articulos : {this.props.itemCount} {this.props.contextMessage}</h4>);
            case "checkout":
                return <CheckoutView cashInputChange={this.updateChange} message={this.props.contextMessage} total={this.props.total} change={this.state.change}/>;
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col">
                    {this.setContent()}
                </div>
            </div>
        );
    }
}

class SellViewport extends React.Component {

    constructor(props) {
        super(props);
        this.productsCache = props.products;
        this.state = {
            context: "sell",
            contextMessage:"",
            order: {
                total: 0,
                items: [],
                payments: []
            }
        }
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        if (event.key === "F1" || event.key === "F2" || event.key === "F3" || event.key === "F4" || event.key === "F5" || event.key === "F6" || event.key === "F7" || event.key === "F8" || event.key === "F9" || event.key === "F10" || event.key === "F11" || event.key === "F12") {
            event.preventDefault();
            switch (event.key) {
                case "F10":
                    switch (this.state.context) {
                        case "sell":
                            this.handleCheckout(event);
                            break;
                    }
                    break;

            }
        }
    }

updateOrder = (state) => {
    let total = 0;
    for (const item of state.order.items) {
        total += (item.price * item.quantity);
    }
    state.order.total = total;
    return state;
}

handleCheckout = (event) => {
        this.setState((state) => {
            if(state.order.total>0){
                state.context = "checkout";
            }else {
                state.contextMessage = "No hay articulos en la orden";
                setTimeout(()=>{this.setState({contextMessage: ""})},2000);
            }
            return state;
        })
}

updateOrderItems = (product, index) => {
    //TODO: Implement modal to select which one when more than one product is found
    if(product.length){
        this.setState((state) => {
            if (index === undefined) {
                let p = product[0];
                p.quantity = 1;
                p.price = p.Price.price;
                p.ProductId = p.id;
                state.order.items.push(p);
                state = this.updateOrder(state);
                return state;
            }
        })
        return;
    }
    Swal.fire('Error', 'No se encontro el producto', 'error');
}

search = (string) => {
    return this.productsCache.filter((element) => {
        return (element.internalCode === string || element.sku === string);
    });
}

modifyItemQuantity = (item, index) => {
    this.setState((state) => {
        state.order.items[index] = item;
        return state;
    });
}

finalizeOrder = (paymentInfo) => {
        const order = this.state.order;
        Swal.fire({
            title: 'Resumen de la orden',
            html: `<h4>Articulos: ${order.items.length}</h4><h4>Total: ${numeral(order.total).format("$0.00")}</h4><h4>Efectivo: ${numeral(paymentInfo.cash).format("$0.00")}</h4><h4>Cambio: ${numeral(paymentInfo.change).format("$0.00")}</h4>`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Cobrar`,
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('api/v0/orders',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(order),
                }).then(r=>r.json()).then((data)=>{
                    console.log(data);
                    this.setState({context:"sell",order:{total:0,items:[],payments:[]}});
                });
            } else if (result.isDenied) {
                this.setState({context: "sell"});
            }
        })
        order.payments.push(paymentInfo);
}

render()
{
    return (
        <div className="container-fluid">
            <div className="row">
                <LCDDisplay order={this.state.order}/>
                <SearchBar order={this.state.order} products={this.props.products}
                           onProductSelected={this.updateOrderItems}/>
                <ItemPanel modifyQuantity={this.modifyItemQuantity} order={this.state.order}/>
                <UtilsView finalizeOrder={this.finalizeOrder} onCheckOutConfirm={this.finalizeOrder} order={this.state.order} contextMessage={this.state.contextMessage} itemCount={this.state.order.items.length} context={this.state.context}/>
            </div>
        </div>
    )
}
}

export default SellViewport;