const {Sequelize, Model, DataTypes} = require("sequelize");
const sequelize = require("../config/sequelize");
const {v4 :uuidv4} = require("uuid");
class User extends Model {
    
    validatePassword(password){
        const bcrypt = require("bcrypt");
        return bcrypt.compareSync(password,this.password);
    }

};

User.init({
    id: {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue:DataTypes.UUIDV4,
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('EMPLOYEE','CLIENT','USER'),
        defaultValue: 'USER',
    },
    permissions: {
        type: DataTypes.JSON,
        defaultValue: {products:false,vendors:false,clients:false,users:false,config:false,reports:false},
        get() {
            return typeof this.getDataValue('permissions')?this.getDataValue('permissions'):JSON.parse(this.getDataValue('permissions'));
        }
    },
    active: {
        type:DataTypes.BOOLEAN,
        defaultValue:true
    },
    parent : DataTypes.UUID
}, {
    sequelize,
    modelName: "User"
});

User.beforeCreate(async (user,options)=>{
    const bcrypt = require("bcrypt");
    user.password = bcrypt.hashSync(user.password, 10);
})

User.beforeUpdate(async (user,options)=>{
    const bcrypt = require("bcrypt");
    user.password = bcrypt.hashSync(user.password, 10);
})

module.exports = User;