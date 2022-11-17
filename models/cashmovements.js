const {Model,DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");
class CashMovements extends Model {};

CashMovements.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    type: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
    },
    notes: DataTypes.STRING,
    cashDrawerId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    cashierId: {
        type: DataTypes.UUID,
        allowNull: false
    }
},{
    sequelize,
    modelName: "CashMovements"
});

module.exports = CashMovements;