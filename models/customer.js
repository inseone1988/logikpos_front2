const {Sequelize,Model,DataTypes} = require("sequelize");
const sequelize =require("../config/sequelize");
const {v4 :uuidv4} = require("uuid");
class Customer extends Model{};

Customer.init({
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    name : DataTypes.STRING,
    lastName : DataTypes.STRING,
    surName : DataTypes.STRING,
    fullName : {
        type : DataTypes.VIRTUAL,
        get(){
            return `${this.name} ${this.lastName} ${this.surName}`;
        },
        set(value){
            throw new Error("Do not try to set the `fullName` value!");
        }
    },
    phone : DataTypes.STRING,
    address : DataTypes.TEXT,
    taxId: DataTypes.STRING,
    businessName : DataTypes.STRING,
    zipCode : DataTypes.STRING,
    active : {
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    creditLimit : DataTypes.DECIMAL,
    balance : {
        type:DataTypes.DECIMAL,
        defaultValue:0
    }
},{
    sequelize : sequelize,
    modelName : "Customer"
})

Customer.beforeCreate(async (user,options)=>{
    const {v4 : uuidv4} = require("uuid");
    user.id = uuidv4();
})

module.exports = Customer;