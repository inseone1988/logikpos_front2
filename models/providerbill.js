const {Sequelize,DataTypes,Model} = require("sequelize");
const sequelize = require("../config/sequelize");
const {v4 :uuidv4} = require("uuid");
class ProviderBill extends Model{};

ProviderBill.init({
    id :{
        primaryKey : true,
        type : DataTypes.UUID,
        allowNull: false
    },
    client_id : DataTypes.INTEGER,
    client_provider_id : DataTypes.INTEGER,
    date : DataTypes.DATE,
    client_product_id: DataTypes.INTEGER,
    amount_supplied : DataTypes.STRING,
    cost : DataTypes.STRING
},{
    sequelize,
    modelName :"ProviderBill"
})

ProviderBill.beforeCreate(async (user,options)=>{
    const {v4 : uuidv4} = require("uuid");
    user.id = uuidv4();
})

module.exports = ProviderBill;