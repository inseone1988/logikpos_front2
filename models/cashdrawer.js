const {Model,DataTypes} = require('sequelize');
const sequelize = require('../config/sequelize');
const Id = require('./ids');

class CashDrawer extends Model {};

CashDrawer.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    cajaId: DataTypes.INTEGER,
    open: DataTypes.BOOLEAN,
    closeTime: DataTypes.DATE,
    currentBalance: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0
    },
    closeCount: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue : 0
    },
    difference: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue : 0
    }
},{
    sequelize,
    modelName:'CashDrawer'
});

CashDrawer.beforeCreate(async(cashdrawer,options)=>{
    let id = await Id.findOne({
        where:{
            tableName:'cashdrawer',
        }
    });
    if(!id){
        id = await Id.create({
            tableName:'cashdrawer',
            idValue:1,
        });
    }
    cashdrawer.cajaId = id.idValue;
    id.idValue = id.idValue + 1;
    await id.save();
});

module.exports = CashDrawer;
