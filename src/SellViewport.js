import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from "react";
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
import $ from 'jquery';
import numeral from 'numeral';
import Swal from 'sweetalert2';

function ItemPanel(props) {

    const rows = props.items ? props.items.map((e, i) => {
        console.log(e);
        let total = (e.quantity * Number(e.price.price));
        return (
            <tr key={i}>
                <td>{e.description}</td>
                <td onDoubleClick={()=>{props.modifyQuantity(e,i)}}>{e.quantity}</td>
                <td onDoubleClick={()=>props.modifyPrice(e,i)}>{numeral(e.price.price).format("$00.00")}</td>
                <td>{numeral(total).format("$00.00")}</td>
            </tr>
        );
    }) : <tr>
        <td className="no-data-row" colSpan={4}> Agregue un articulo</td>
    </tr>;

    return (
        <div className="row mt-3">
            <div className="col-12">
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
            {props.total ? numeral(props.total).format("$00.00") : "$0.00"}
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

    function getProduct(element) {
        console.log(element.keyCode);
        if (element.keyCode === 13) {
            $.ajax({
                url: `/api/v0/products?id=${element.currentTarget.value}`,
                success: (res) => {
                    console.log(res);
                    if (res.success) {
                        res.payload.quantity = 1;
                        props.onresult(res.payload);
                    }else{
                        Swal.fire({
                            title: "Error",
                            text:res.message,
                            icon:"error"
                        })
                    }
                    $("#code").val("");
                }
            })
        }

    }

    return (
        <div className="row search-bar-end">
            <div className="col-12">
                <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text">
                        <i className="bi-search" />
                    </span>
                    <input id={"code"} onKeyUp={getProduct.bind(this)} type="text" className="form-control" placeholder="Captura codigo de producto" />
                </div>
            </div>
        </div>
    )
}

function SearchBar(props) {
    return (
        <div className="col-sm-12 col-md-8">
            <CodeCapture onresult={props.onsearchresult} />
        </div>
    );
}

function ButtonBar(props) {
    return (<div className='row'>
        <div className="col-12">
            <div className="btn-group mt-3 mb-2 d-flex align-items-center justify-items-center">
                <button type='button' className='btn btn-outline-info'><i className="bi-plus"></i>IVA</button>
                <button type='button' className='btn btn-outline-info'>Presupuesto</button>
                <button onClick={()=>{props.clickCallback("cobrar")}} type='button' className='btn btn-primary'>Cobrar</button>
                <button type='button' className='btn btn-danger'>Cancelar</button>
            </div>
        </div>
    </div>);
}

function CobrarViewPort(props){
    return (
        <div className="row">
            <div className="col">
                <h1>Hello world</h1>
            </div>
        </div>
    );
}

class SellViewport extends React.Component {


    constructor(props) {
        super(props);
        this.state = { order: {items:undefined}, orderLoaded: false, user : undefined }
    }

    componentDidMount() {
        if (!this.state.loaded) {
            $.ajax({
                url: "/api/v0/orders",
                success: (res) => {
                    if (res.success) {
                        this.setState({ order: res.payload, orderLoaded: true })
                    }
                }
            });
            this.setState({ loaded: true });
        }

    }

    updateRows = (product)=> {
        let o = this.state.order;
        if(!o.items) o.items = [];
        o.items.push(product);
        o.total = 0;
        for (const item of o.items) {
            o.total += Number(item.price.price)*item.quantity;
        }
        this.setState({
            order: o
        })
    }

    modifyQuantityCallback = (item,index)=>{
        Swal.fire({
            title:"Cantidad",
            input:"number",
            inputValue:item.quantity
        }).then((res)=>{
            if (res.isConfirmed){
                let i = this.state.order.items[index];
                i.quantity = Number(res.value);
                this.state.order.total = 0;
                for (const item1 of this.state.order.items) {
                    this.state.order.total += Number(item1.price.price) * item1.quantity;
                }
                this.setState({order: this.state.order});
            }
        })
    }

    handleButtonClick = (action)=>{
        switch (action){
            case "cobrar":
                Swal.fire({
                    title:numeral(this.state.order.total).format("$00.00"),
                    text:"Efectivo",
                    input:"number"
                }).then((res)=>{
                    $.ajax({
                        url:"/api/v0/orders",
                        type:"post",
                        DataType:"JSON",
                        data: {
                            data: JSON.stringify(this.state.order)},
                        success:(r)=>{
                            console.log(r);
                        }
                    })
                });
                break;
        }
    }

    modifyPrice = (product,index)=>{
        Swal.fire({
            title:"Precio",
            input:"decimal",
            inputValue:product.price.price
        }).then((res)=>{
            if (res.isConfirmed){
                let i = this.state.order.items[index];
                i.price.price = Number(res.value);
                this.state.order.total = 0;
                for (const item1 of this.state.order.items) {
                    this.state.order.total += Number(item1.price.price) * item1.quantity;
                }
                this.setState({order: this.state.order});
            }
        })
    }

    render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <LCDDisplay total={this.state.order.total}/>
                    <SearchBar onsearchresult={this.updateRows} folio={this.state.order ? this.state.order.orderId : 0} />
                    <ItemPanel onRequestPriceChange={this.modifyPrice} modifyQuantity={this.modifyQuantityCallback} items={this.state.order.items} />
                    <ButtonBar clickCallback={this.handleButtonClick}/>
                </div>
            </div>
        )
    }
}

export default SellViewport;