const {Sequelize,DataTypes,Model} = require("sequelize");
const sequelize = require("../config/sequelize");
const {v4 :uuidv4} = require("uuid");
class OrderDetail extends Model{};

OrderDetail.init({
    id :{
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull: false
    },
    returnDate : DataTypes.DATE,
    quantity : DataTypes.STRING,
    price : DataTypes.STRING

},{
    sequelize,
    modelName :"OrderDetail"
})

OrderDetail.beforeCreate(async (orderDetail,options)=>{
    const Inventory = require("../models/inventory");
    let i = await Inventory.findOne({
        where : {
            ProductId : orderDetail.ProductId
        }
    });
    if(i){
        i.currentSupply -= orderDetail.quantity;
    }
    await i.save();
})

module.exports = OrderDetail;