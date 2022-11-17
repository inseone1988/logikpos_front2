const {Sequelize} = require("sequelize");

//const sequelize = new Sequelize("logikpos", "root", "", {
//    host: "localhost",
//    dialect: "mysql"
//});

const databaseName = Date.now();

 const sequelize = new Sequelize({
     dialect : "sqlite",
     storage: `databases/1666901381956.db`,
     // storage: `databases/${databaseName}.db`
     //storage : "logikpos.db"
 })

sequelize.recreateDB = async function () {
    const Client = require("../models/client");
    const Customer = require("../models/customer");
    const Inventory = require("../models/inventory");
    const OrderDetail = require("../models/orderdetail");
    const Product = require("../models/product");
    const Price = require("../models/price");
    const Provider = require("../models/provider");
    const User = require("../models/user");
    const Order = require("../models/order");
    const Payment = require("../models/payment");
    const Id = require("../models/ids");
    const CashDrawer = require("../models/cashdrawer");
    const CashMovement = require("../models/cashmovements");
    //define associations
    Client.hasOne(User);
    User.belongsTo(Client);
    Client.hasMany(Product);
    Client.hasMany(Customer);
    Client.hasMany(Order);
    Client.hasMany(Provider);
    Customer.hasMany(Order);
    Order.hasMany(OrderDetail);
    Order.hasMany(Payment);
    Order.belongsTo(Client);
    Order.belongsTo(Customer);
    OrderDetail.belongsTo(Order);
    OrderDetail.belongsTo(Product);
    Payment.belongsTo(Order);
    Product.hasMany(OrderDetail);
    Product.hasOne(Price);
    Product.hasOne(Inventory);
    Product.hasOne(Provider);
    Product.belongsTo(Client);
    Provider.hasMany(Product);
    Inventory.belongsTo(Product);
    Price.belongsTo(Product);
    Client.hasMany(CashDrawer);
    try {
        console.log("conectando con el servidor");
        await sequelize.authenticate();
        console.log("Base de datos creada. Intentando crear tablas");
        await Client.sync();
        await Provider.sync();
        await Product.sync();
        await Customer.sync();
        await Order.sync();
        await User.sync();
        await Inventory.sync();
        await OrderDetail.sync();
        await Payment.sync();
        await Price.sync();
        await Id.sync();
        await CashDrawer.sync();
        await CashMovement.sync();
        //Lets create a default product provider
        let p = await Provider.findOne({
            where: {
                id: 1
            }
        });
        //Find or create admin user
        let u = await User.findOne({
            where: {
                id: 1
            }
        });
        if (!u) {
            u = await User.create({
                id: 1,
                userName: "admin",
                password: "12345",
                role: "admin",
                ClientId: 1,
                Client: {
                    id:1,
                    name: "LogikPOS",
                    address: "Calle 1",
                    phone: "1234567890",
                    email: "admin@logikpos.com",
                    rfc: "XAXX010101000",
                    logo: "https://logikpos.com/img/logo.png"
                }
            },{
                include : [Client]
            });
        }
        if (!p) {
            p = await Provider.create({
                id: 1,
                name: "Default Provider",
                last_name : "Proveedor por defecto",
                social_name : "Proveedor por defecto"
            });
        }
        //And a default customer
        let c = await Customer.findOne({
            where: {
                id: 1
            }
        });
        if (!c) {
            c = await Customer.create({
                id: 1,
                name: "Venta al público",
                lastName : "en general",
                address : "n/a",
                phone : "n/a",
                active : true,
            });
        }
        console.log("Tablas creadas checar schema");
    } catch (e) {
        console.error("No se ha podido conectar con la BD", e)
    }
}

module.exports = sequelize;