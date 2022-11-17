const {Sequelize,DataTypes,Model} = require("sequelize");
const sequelize = require("../config/sequelize");

class Order extends Model{};

Order.init({
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    orderId : DataTypes.INTEGER,
    total : {
        type : DataTypes.DECIMAL,
        defaultValue : 0.0
    },
    cashierId : DataTypes.UUID,
    cashDrawerId : DataTypes.UUID,
    returnDate : DataTypes.DATE,
    type : {
        type:DataTypes.ENUM("SALE","BUDGET","INVOICE","PURCHASE","TRANSFER"),
        defaultValue : "PURCHASE"
    },
    status : {
        type : DataTypes.BOOLEAN,
        defaultValue : true
    }
},{
    sequelize,
    modelName: 'Order'
});

Order.beforeCreate(async (order,options)=>{
    const Id = require("../models/ids");
    let i = await Id.findOne({
        where : {
            tableName : "Order",
            CustomerId : order.ClientId
        }
    });
    if(!i){
        i = await Id.create({
            tableName : "Order",
            idValue : 1,
            CustomerId : order.ClientId
        });
    }
    
    order.orderId = i.idValue;
    i.idValue = i.idValue + 1;
    await i.save();
});

Order.afterCreate(async (order,options)=>{
    const CashDrawer = require("../models/cashdrawer");
    let c = await CashDrawer.findOne({
        where : {
            open : true,
        }
    });
    if(c){
        c.currentBalance += order.total;
        await c.save();
    }
});

module.exports = Order;