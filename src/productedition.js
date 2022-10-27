import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './styles.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import $ from 'jquery';
import moment from 'moment';
import 'sweetalert2/dist/sweetalert2.css';
import Swal from 'sweetalert2';


function ProductEditor(props) {
    return (
        <div className="row">
            <div className="col-xxsm-12 col-sm-12">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Descripcion</label>
                    <input defaultValue={props.product?props.product.description:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="description" type="text" className="form-control" />
                </div>
            </div>
            <div className='col-xxsm-12 col-sm-6 col-md-4'>
                <div className="form-group">
                    <label htmlFor="" className="form-label">Codigo interno</label>
                    <input defaultValue={props.product?props.product.internalCode:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="internalCode" type="text" className="form-control" />
                </div>
            </div>
            <div className='col-xxsm-12 col-sm-6 col-md-4'>
                <div className="form-group">
                    <label htmlFor="" className="form-label">SKU</label>
                    <input defaultValue={props.product?props.product.sku:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="sku" type="text" className="form-control" />
                </div>
            </div>
            <div className="col-xxsm-12 col-sm-6 col-md-4 mb-3">
                <div className="form-group">
                    <label htmlFor="" className="form-label">Precio</label>
                    <input defaultValue={props.product?props.product.price:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="price" type="text" className="form-control" />
                </div>
            </div>
            <div className="col-12 mb-3">
                <div className="row">
                    <div className="col-12">
                        <div className="card">
                            <div className="card-header">
                                Inventario
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="" className="form-label">Existencias</label>
                                            <input defaultValue={props.product?props.product.currentAmmount:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="currentAmmount" type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <div className="form-group">
                                            <label htmlFor="" className="form-label">Existencias minimas</label>
                                            <input defaultValue={props.product?props.product.minimalExistences:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="minimalExistences" type="text" className="form-control" />
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="" className="form-label">Proveedor</label>
                                            <select defaultValue={props.product?props.product.ProviderId:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="ProviderId" defaultValue={"Seleccione un provedor"} type="text" className="form-select">
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-12">
                                        <div className="form-group">
                                            <label htmlFor="" className="form-label">Costo</label>
                                            <input defaultValue={props.product?props.product.cost:""} onChange={(e)=>{props.handleProductUpdate(e.target.value,e.target.name)}} name="cost" type="text" className="form-control"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <button onClick={props.saveProuctCallback} className="btn btn-sm btn-primary">Guardar</button>
            </div>
        </div>
    );
}

function ProductsInfo(props) {

    let rows = props.products ? props.products.map((p, i) => {
        return (
            <tr onDoubleClick={()=>props.editProduct(p,i)} key={i}>
                <td>{p.description}</td>
                <td>{p.internalCode}</td>
                <td>{p.sku}</td>
                <td>{p.price.price}</td>
                <td>{}</td>
                <td>{}</td>
            </tr>);
    }) : (<tr><td colSpan={6} className='no-data-row'>Toma el control de tu negocio e inicia agregando productos a tu inventario</td></tr>);

    return (
        <div className="row">
            <div className="col-12">
                <table className="table table-sm table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>Descripcion de producto</th>
                            <th>Codigo interno</th>
                            <th>SKU</th>
                            <th>Precio</th>
                            <th>Proveedor</th>
                            <th>Existencias</th>
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

class ProductEdition extends React.Component {


    constructor(props) {
        super(props);
        this.state = { products: undefined, editing: false, selectedProduct: undefined, cardTitle: "Productos" };
    }

    productSaveCallback = ()=>{
        if(!this.state.products) this.state.products = [];
        if(!this.state.selectedProduct.index&&this.state.selectedProduct.index !==0)this.state.products.push(this.state.selectedProduct);
        this.setState({products:this.state.products,editing:false,selectedProduct:undefined,cardTitle:"Productos"})
    }

    handleProductUpdate = (v,n)=>{
        if (!this.state.selectedProduct) this.state.selectedProduct = {};
        this.state.selectedProduct[n] = v;
    }

    whatToDisplay() {
        switch (this.state.cardTitle) {
            case 'Productos':
                return <ProductsInfo editProduct={this.setEditingProduct} products={this.state.products} />
            case 'Edicion de producto':
                return <ProductEditor handleProductUpdate={this.handleProductUpdate} saveProuctCallback={this.productSaveCallback} product={this.state.selectedProduct} />
            default:
                break;
        }
    }

    setEditingProduct = (p,i)=> {
        //if(p){p.index = i};
        p?p.index=i:p.index=0;
        this.setState({ editing: true,selectedProduct:p?p:undefined,cardTitle:"Edicion de producto"});

    }

    setEditMode = () => {
        this.setState({ editing: true, cardTitle: "Edicion de producto" });
    }

    render() {
        return (
            <div className="container">
                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            <h5>{this.state.cardTitle}</h5>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <button disabled={this.state.editing} onClick={this.setEditMode} className={`btn btn-sm btn-primary ${this.state.editing ? "d-none" : ""}`}>
                                    Agregar producto
                                    <i className="bi-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        {this.whatToDisplay()}
                    </div>
                </div>
            </div>
        )
    }
}

export default ProductEdition;