import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from "react";
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

function ItemPanel(props){

    const rows = props.items ? props.items.map((e,i)=>{
        let total = (e.quantity * Number(e.product.price));
        return(
            <tr>
                <td>{e.product.description}</td>
                <td>{e.quantity}</td>
                <td>{e.product.price.price}</td>
                <td>{total}</td>
            </tr>
        );
    }) : <tr>
        <td className="no-data-row" colSpan={4}> Agregue un articulo</td>
    </tr>;

    return(
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

function LCDDisplay(props){
    return(
        <div className="col-sm-12 col-md-4 lcd-display">
            {props.order?props.order.total:"$0.00"}
        </div>
    );
}

function FolioDisplay(props) {
    return(
        <div className="row">
            <div className="col-12">
                <h4> Folio : {props.folio}</h4>
            </div>
        </div>
    );
}

function CodeCapture(props){
    return(
        <div className="row">
            <div className="col-12">
                <div className="input-group input-group-lg mb-3">
                    <span className="input-group-text">
                        <i className="bi-search"/>
                    </span>
                    <input type="text" className="form-control" placeholder="Captura codigo de producto o descripcion"/>
                </div>
            </div>
        </div>
    )
}

function SearchBar(props){
    return(
        <div className="col-sm-12 col-md-8">
            <FolioDisplay folio={props.folio?props.folio:"Verifique su conexion a internet"}/>
            <CodeCapture onresult={props.onsearchresult}/>
        </div>
    );
}

class SellViewport extends React.Component{

    constructor(props) {
        super(props);
        this.state = {order : props.order}
    }

    updateRows(product){
        let o = this.state.order;
        o.items.push(product);
        this.setState({
            order: o
        })
    }

    render(){
        return(
            <div className="container-fluid bg-light">
                <div className="row">
                    <LCDDisplay/>
                    <SearchBar/>
                    <ItemPanel/>
                </div>
            </div>
        )
    }
}

export default SellViewport;