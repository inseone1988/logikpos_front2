const {Sequelize, DataTypes, Model} = require("sequelize");
const sequelize = require("../config/sequelize");
const {v4: uuidv4} = require("uuid");

class Inventory extends Model {
};

Inventory.init({
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    lastSupplyDate: DataTypes.DATE,
    lastProviderId: {
        type: DataTypes.DATE,
        defaultValue: 1,
    },
    lastCost: DataTypes.STRING,
    currentSupply: {
        type: DataTypes.STRING,
        defaultValue: 0
    },
    minExistences: {
        type:DataTypes.STRING,
        defaultValue: 0
    },
    allowLowInventory: {
        type : DataTypes.BOOLEAN,
        defaultValue: true
    },
    onLowInventory: {
        type:DataTypes.STRING,
        defaultValue: "WARN"
    }
}, {
    sequelize,
    modelName: "Inventory"
});

module.exports = Inventory;