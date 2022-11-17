const {Sequelize, DataTypes, Model, UUIDV4} = require("sequelize");
const sequelize = require("../config/sequelize");
const {v4 :uuidv4} = require("uuid");
class Payment extends Model {
};

Payment.init({
    id: {
        primaryKey : true,
        defaultValue:UUIDV4,
        type : DataTypes.UUID,
        allowNull: false
    },
    status : DataTypes.STRING,
    type : {
        type:DataTypes.ENUM("CASH","CARD","TRANSFER","CHECK","OTHER"),
        defaultValue:"CASH"
    },
    total : DataTypes.DECIMAL,
    cash : DataTypes.DECIMAL,
    change : DataTypes.DECIMAL
},{
    sequelize,
    modelName: 'Payment'
})

module.exports = Payment;