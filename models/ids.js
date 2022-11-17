const {Model,DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");

class Id extends Model{};
Id.init({
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
    },
    tableName : DataTypes.STRING,
    idValue : DataTypes.INTEGER,
    CustomerId : DataTypes.UUID
},{
    sequelize,
    modelName: 'Id'
});

module.exports = Id;