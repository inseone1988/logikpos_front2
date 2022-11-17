const {Sequelize, DataTypes, Model} = require("sequelize");
const sequelize = require("../config/sequelize");

class Client extends Model{};

Client.init({
    id :{
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
    },
    name : DataTypes.STRING,
    lastName : DataTypes.STRING,
    fullName:{
        type: DataTypes.VIRTUAL,
        get(){
            return `${this.name} ${this.lastName}`
        },
        set(value){
            throw new Error("Operacion no permitida")
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        unique : true,
        type : DataTypes.STRING},
    verified : DataTypes.BOOLEAN
},{
    sequelize,
    modelName : "Client"
})

module.exports = Client;