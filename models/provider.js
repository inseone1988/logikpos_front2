const {Sequelize,DataTypes,Model} = require("sequelize");
const sequelize = require("../config/sequelize");
const {v4 :uuidv4} = require("uuid");
class Provider extends Model{};

Provider.init({
    id :{
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull: false
    },
    name : DataTypes.STRING,
    last_name : DataTypes.STRING,
    social_name : DataTypes.STRING
},{
    sequelize,
    modelName :"Provider"
})

Provider.beforeCreate(async (user,options)=>{
    const {v4 : uuidv4} = require("uuid");
    user.id = uuidv4();
})

module.exports = Provider;