const {Sequelize, DataTypes,Model} = require("sequelize");
const sequelize = require("../config/sequelize");

class Product extends Model{};

Product.init({
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    //Check if client_productId is useful
    //client_product_id :DataTypes.INTEGER,
    sku : {
        type: DataTypes.STRING,
        defaultValue : ""
},
    internalCode : {
        type : DataTypes.STRING,
        defaultValue: ""
    },
    description : {
        type : DataTypes.STRING,
        defaultValue: "Agrege una descripcion"
    },

},{
    sequelize ,
    modelName: "Product"
});

module.exports = Product;