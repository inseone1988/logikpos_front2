import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from "react";
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import numeral from 'numeral';
import Swal from 'sweetalert2';
import '@tarekraafat/autocomplete.js/dist/css/autoComplete.css';
import '@tarekraafat/autocomplete.js/dist/autoComplete';

function ProductSearch(props) {

    const rows = props.searchResult.length ? props.searchResult.map((product, index) => {
        return (
            <tr className={`${product.Inventory.currentSupply < product.Inventory.minimalExistences?"bg-warning":""}`} key={index} onClick={() => props.selectProduct([product])}>
                <td>{product.description}</td>
                <td>{product.internalCode}</td>
                <td>{product.sku}</td>
                <td>{product.Price.price}</td>
            </tr>
        )
    }) : <tr><td className={"no-data-row"} colSpan={5}>No se encontraron resultados</td></tr>;

    return (
        <div className="row">
            <div className="col-sm-12 col-md-6 ">
                <h5>Busqueda de articulos</h5>
                <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text">
                        <i className="bi-search" />
                    </span>
                    <input onChange={(e) => { props.search(e.target.value) }} autoFocus={true} id={"search"} type="text" className="form-control" placeholder="Buscar producto" />
                </div>
            </div>
            <div className="col-12">
                <table className="table table-bordered table-stripped">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Codigo interno</th>
                            <th>Sku</th>
                            <th>Precio</th>
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

    function modifyItemPrice(element, index, event) {
        Swal.fire({
            title: 'Precio',
            text: element.description,
            input: 'number',
            inputValue: element.price
        }).then((result) => {
            if (result.isConfirmed) {
                element.price = result.value;
                props.modifyPrice(element, index);
            }
        });
    }

    const rows = props.order.items.length ? props.order.items.map((e, i) => {
        let total = (e.quantity * Number(e.price));
        return (
            <tr onClick={() => props.onSelectItem(e, i)} key={i}>
                <td>{e.description}</td>
                <td onDoubleClick={(event) => modifyQuantity(e, i, event)}>{e.quantity}</td>
                <td onDoubleClick={() => modifyItemPrice(e, i)}>{numeral(e.price).format("$0.00")}</td>
                <td>{numeral(total).format("$0.00")}</td>
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

    function cashMovement() {
        Swal.fire({
            title: 'Movimiento de efectivo',
            text: "Ingrese tipo de movimiento y monto",
            html: `<div class="input-group mb-3">
                        <span class="input-group-text">
                            <i class="bi-currency-dollar"></i>
                        </span>
                       <input id="cashMovementAmount" type="number" class="form-control form-control-lg" placeholder="Monto" /> 
                   </div>
                   <div class="form-floating mb-3">
                        <textarea name="Notas" id="cm-notes" cols="30" rows="10" class="form-control"></textarea>
                        <label for="cm-notes">Comentarios</label>
                   </div>
                   <div class="form-check">
                        <input class="form-check-input" type="radio" name="cashMovementType" id="cashMovementType1" value="1" checked>
                        <label class="form-check-label" for="cashMovementType1">Ingreso</label>
                   </div>
                   <div class="form-check">
                        <input class="form-check-input" type="radio" name="cashMovementType" id="cashMovementType2" value="2">
                        <label class="form-check-label" for="cashMovementType2">Egreso</label>
                   </div>`,
            showCancelButton: true,
            confirmButtonText: 'Aceptar',
            cancelButtonText: 'Cancelar',
            showLoaderOnConfirm: true,
            preConfirm: () => {
                return {
                    amount : document.getElementById('cashMovementAmount').value,
                    type : document.querySelector('input[name="cashMovementType"]:checked').value,
                    notes : document.getElementById('cm-notes').value
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'Resumen de movimiento',
                    html: `<p>Monto: ${result.value.amount}</p>
                            <p>Tipo: ${result.value.type === "1" ? "Ingreso" : "Egreso"}</p>
                            <p>Comentarios: ${result.value.notes}</p>`,
                    showCancelButton: true,
                    confirmButtonText: 'Aceptar',
                    cancelButtonText: 'Cancelar',
                    showLoaderOnConfirm: true,
                    preConfirm: () => {
                        return result;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetch('/api/v0/cashmvts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(result.value.value)
                        }).then((response) => {
                            if (response.success) {
                                Swal.fire({
                                    title: 'Movimiento registrado',
                                    icon: 'success',
                                    showConfirmButton: false,
                                    timer: 1500
                                });
                            }
                        })
                    }
                })
            }
        })
    }

    /**
     * Helper methos to populate fake products for testing
     */
    async function createFakeProducts() {
        await fetch('api/v0/products/faketize');
    }

    return (
        <div className="row search-bar-end">
            <div className="col-12">
                <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text bg-main">
                        <i className="bi-upc-scan"></i>
                    </span>
                    <input id={"code"} onKeyUp={getProduct.bind(this)} type="text" className="form-control"
                        placeholder="Captura codigo de producto" />
                </div>
                <div className="btn-group">
                    <button onClick={props.cobrar} className="btn btn-sm btn-primary">Cobrar [F2]</button>
                    <button onClick={props.iva} className="btn btn-sm btn-primary">IVA [F3]</button>
                    <button onClick={props.cancel} className="btn btn-sm btn-primary">Cancelar orden [F4]</button>
                    <button onClick={()=>cashMovement()} className="btn btn-sm btn-primary">Mov. Caja [F5]</button>
                    <button onClick={props.setSearchView} className="btn btn-sm btn-primary">Buscar [F10]</button>
                    <button className="btn btn-sm btn-primary">Cierre de caja [F12]</button>
                </div>
            </div>
        </div>
    )
}

function SearchBar(props) {
    return (
        <div className="col-sm-12 col-md-8">
            <CodeCapture cobrar={props.checkout} iva={props.tax} cancel={props.cancel} setSearchView={props.setSearchView} search={props.search} products={props.products} onProductSelected={props.onProductSelected} />
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


function CheckoutView(props) {
    return (
        <div className="row">
            <div className="col-auto">
                <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text"><h4>Efectivo <i className="bi-currency-dollar"></i></h4></span>
                    <input autoFocus={true} onKeyUp={(e) => props.cashInputChange(e)} type="number" step={0.50}
                        className="form-control" />
                </div>
            </div>
            <div className="col-auto">
                <h3 className={props.change < 0 ? "text-danger" : "text-success"}>{`${props.change < 0 ? "Faltan" : "Cambio"}: ${numeral(props.change).format("$0.00")}`}</h3>
            </div>
        </div>
    );
}


class UtilsView extends React.Component {


    constructor(props, context) {
        super(props, context);
        this.state = { contextMessage: this.props.message, context: this.props.context, change: 0.0 };
    }

    updateChange = (event) => {
        let change = event.target.value - this.props.order.total;
        console.log(event.keyCode);
        this.setState({ change: change });
        if (event.keyCode === 13) {
            this.props.finalizeOrder({ change: change, total: this.props.order.total, cash: event.target.value });
        }
    }

    setContent() {
        switch (this.props.context) {
            case "sell":
                return (<h4>Cantidad de articulos : {this.props.itemCount} {this.props.contextMessage}</h4>);
            case "checkout":
                return <CheckoutView cashInputChange={this.updateChange} message={this.props.contextMessage}
                    total={this.props.total} change={this.state.change} />;
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
            contextMessage: "",
            order: {
                total: 0,
                items: [],
                payments: []
            },
            searchResult: [],
        }
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handleKeyDown);
    }

    handleKeyDown = (event) => {
        if (event.key === "F1" || event.key === "F2" || event.key === "F3" || event.key === "F4" || event.key === "F5" || event.key === "F6" || event.key === "F7" || event.key === "F8" || event.key === "F9" || event.key === "F10" || event.key === "F12" || event.key === "Delete") {
            event.preventDefault();

            switch (event.key) {
                case "F2":
                    switch (this.state.context) {
                        case "sell":
                            this.handleCheckout(event);
                            break;
                    }
                    break;
                case "F3":
                    switch (this.state.context) {
                        case "sell":
                            this.applyTax();
                            break;
                    }
                    break;
                case "F4":
                    switch (this.state.context) {
                        case "sell":
                            this.cancelOrder();
                            break;
                    }
                    break;
                case "F10":
                    switch (this.state.context) {
                        case "sell":
                            this.setSearchView();
                            break;
                    }
                case 'Delete':
                    switch (this.state.context) {
                        case 'sell':
                            this.deleteItem();
                            break;
                    }
                    break;

            }
        }
    }

    applyTax = ()=>{
        this.setState((state) => {
            console.log(state);
            state.order.tax = !state.order.tax;
            return this.updateOrder(state);
        })
    }

    updateOrder = (state) => {
        let total = 0;
        for (const item of state.order.items) {
            total += (item.price * item.quantity);
        }
        state.order.taxAmount = (total * 0.16);
        if (state.order.tax) total += state.order.taxAmount;
        state.order.total = Number(numeral(total).format("0.00"));
        return state;
    }

    handleCheckout = (event) => {
        this.setState((state) => {
            if (state.order.total > 0) {
                state.context = "checkout";
            } else {
                state.contextMessage = "No hay articulos en la orden";
                setTimeout(() => {
                    this.setState({ contextMessage: "" })
                }, 2000);
            }
            return state;
        })
    }

    updateOrderItems = (product, index) => {
        if (product.length) {
            this.setState((state) => {
                if (state.context === "search") state.context = "sell";
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
            return this.updateOrder(state);
        });
    }

    finalizeOrder = (paymentInfo) => {
        const order = this.state.order;
        if (paymentInfo.cash < order.total) {
            return Swal.fire({
                title: ":(",
                html: `<h4>El monto pagado es menor al total de la orden</h4>`,
                icon: "error"
            })
        }
        Swal.fire({
            title: 'Resumen de la orden',
            html: `<h4>Articulos: ${order.items.length}</h4><h4>Total: ${numeral(order.total).format("$0.00")}</h4><h4>Efectivo: ${numeral(paymentInfo.cash).format("$0.00")}</h4><h4>Cambio: ${numeral(paymentInfo.change).format("$0.00")}</h4>`,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: `Cobrar`,
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('api/v0/orders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(order),
                }).then(r => r.json()).then((data) => {
                    console.log(data);
                    if (data.success) {
                        Swal.fire('Orden cobrada', `Folio : ${data.payload.orderId}`, 'success');
                        this.setState({ context: "sell", order: { total: 0, items: [], payments: [] } });
                        this.props.loadProducts();
                    } else {
                        Swal.fire('Error', data.message, 'error');
                    }
                });
            } else if (result.isDenied) {
                this.setState({ context: "sell" });
            }
        })
        order.payments.push(paymentInfo);
    }

    modifyItemPrice = (item, index) => {
        this.setState((state) => {
            state.order.items[index].lastPrice = state.order.items[index].price;
            state.order.items[index] = item;
            return this.updateOrder(state);
        })
    }

    deleteItem = () => {
        this.setState((state) => {
            if(state.selectedItem){
                state.order.items.splice(state.selectedItem.index, 1);
            return this.updateOrder(state);
            }
            return state;
        })
    }

    cancelOrder = () => {
        this.setState({ context: "sell", order: { total: 0, items: [], payments: [] }, selectedItem: undefined });
    }

    selectItem = (item, index) => {
        this.setState({ selectedItem: { item, index } });
    }

    setSearchView = () => {
        this.setState({ context: "search" });
    }

    searchProduct = (string) => {
        if (string.length > 3) {
            const result = this.props.products.filter((element) => {
                string = string.toLowerCase();
                return (element.internalCode.toLowerCase() === string || element.sku.toLowerCase() === string || element.description.toLowerCase().includes(string));
            });
            this.setState({ searchResult: result });
        }
    }

    whatToShow() {
        switch (this.state.context) {
            case "sell":
                return (<div className="row">
                    <LCDDisplay order={this.state.order} />
                    <SearchBar checkout={this.handleCheckout} tax={this.applyTax} cancel={this.cancelOrder} search={this.searchProduct}  setSearchView={this.setSearchView} order={this.state.order} products={this.props.products}
                        onProductSelected={this.updateOrderItems} />
                    <ItemPanel onSelectItem={this.selectItem} deleteIte={this.deleteItem}
                        modifyPrice={this.modifyItemPrice} modifyQuantity={this.modifyItemQuantity}
                        order={this.state.order} />
                    <UtilsView finalizeOrder={this.finalizeOrder}
                        onCheckOutConfirm={this.finalizeOrder} order={this.state.order}
                        contextMessage={this.state.contextMessage} itemCount={this.state.order.items.length}
                        context={this.state.context} />
                </div>)
            case "search":
                return <ProductSearch
                    searchResult={this.state.searchResult}
                    search={this.searchProduct}
                    selectProduct={this.updateOrderItems}
                    updateOrderItems={this.updateOrderItems}
                />
            default:
                return (<div className="row">
                    <LCDDisplay order={this.state.order} />
                    <SearchBar search={this.setSearchView} order={this.state.order} products={this.props.products}
                        onProductSelected={this.updateOrderItems} />
                    <ItemPanel onSelectItem={this.selectItem} deleteIte={this.deleteItem}
                        modifyPrice={this.modifyItemPrice} modifyQuantity={this.modifyItemQuantity}
                        order={this.state.order} />
                    <UtilsView finalizeOrder={this.finalizeOrder}
                        onCheckOutConfirm={this.finalizeOrder} order={this.state.order}
                        contextMessage={this.state.contextMessage} itemCount={this.state.order.items.length}
                        context={this.state.context} />
                </div>)
        }
    }

    render() {
        return (
            <div className="container-fluid">
                {this.whatToShow()}
            </div>
        )
    }
}

export default SellViewport;