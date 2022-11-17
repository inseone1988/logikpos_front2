const {Sequelize,DataTypes,Model} = require("sequelize");
const sequelize = require("../config/sequelize");
class Price extends Model{};

Price.init({
    id :{
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull: false
    },
    price : {
        type: DataTypes.STRING,
        required : true
    }
},{
    sequelize,
    modelName :"Price"
});

module.exports = Price;