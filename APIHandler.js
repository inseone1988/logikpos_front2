const User = require("./models/User");
const Product = require("./models/Product");
const Price = require("./models/Price");
const Inventory = require("./models/Inventory");
const Client = require("./models/Client");
const Customer = require("./models/Customer");
const Provider = require("./models/Provider");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const Payment = require("./models/payment");
const Order = require("./models/Order");
const OrderItem = require("./models/orderdetail");
const CashDrawer = require("./models/cashdrawer");

const session = {};

function parseResult(result) {
    if (result) {
        return JSON.parse(JSON.stringify(result));
    }
}

const api = {
    'session.check': async () => {
        return { success: session.user, payload: session.user ? session.user : null };
    },
    'login': async (e, a) => {
        let cashdrawer = await CashDrawer.findOne({ where: { open: true } });
        let u = await User.findOne({
            where: {
                username: a.username
            },
            include: [User.belongsTo(Client)]
        });
        if (u) {
            if (u.validatePassword(a.password)) {
                if (!cashdrawer) {
                    cashdrawer = await CashDrawer.create({ open: true});
                }
                session.cashDrawer = cashdrawer;
                session.user = parseResult(u);
                return { success: true, payload: parseResult(u) };
            }
        }

        return { success: false, error: "Invalid credentials" };
    },
    'logout': async (e, a) => {
        delete session.user;
        return { success: true };
    },
    'user.create': async (e, a) => {
        let u = await Client.create(a.user, { include: [Client.hasOne(User)] });
        return { success: true, payload: parseResult(u) };
    },
    'user.update': async (e, a) => {
        await User.update(a.user, { where: { id: a.user.id } });
        await Client.update(a.user.Client, { where: { id: a.user.Client.id } });
        return { success: true };
    },
    'user.delete': async (e, a) => {
        let u = await User.destroy({ where: { id: a.user } });
        return { success: true };
    },
    'user.getAll': async (e, a) => {
        let u = await User.findAll({ where: { [Op.not]: { id: 1 } }, include: [User.belongsTo(Client)] });
        return { success: true, payload: parseResult(u) };
    },
    'product.create': async (e, a) => {
        let u = await Product.create(a.product, { include: [Product.hasOne(Price), Product.hasOne(Inventory)] });
        return { success: true, payload: parseResult(u) };
    },
    'product.update': async (e, a) => {
        let p = await Product.findOne({
            where: { id: a.product.id },
            include: [Product.hasOne(Price), Product.hasOne(Inventory)]
        });
        let price = p.Price;
        let inventory = p.Inventory;
        if (p) {
            await p.update(a.product);
            await price.update(a.product.Price);
            await inventory.update(a.product.Inventory);
            p = await p.reload({ include: [Product.hasMany(Price), Product.hasOne(Inventory)] });
            return { success: true, payload: parseResult(p) };
        }
    },
    'product.delete': async (e, a) => {
        let u = await Product.destroy({ where: { id: a.product } });
        return { success: true, payload: parseResult(u) };
    },
    'product.getAll': async (e, a) => {
        let p = await Product.findAll({ include: [Product.hasOne(Price), Product.hasOne(Inventory)] });
        return { success: true, payload: parseResult(p) };
    },
    'customer.create': async (e, a) => {
        let c = await Customer.create(a.customer);
        return { success: true, payload: parseResult(c) };
    },
    'customer.update': async (e, a) => {
        let c = await Customer.update(a.customer, { where: { id: a.customer.id } });
        return { success: true, payload: parseResult(c) };
    },
    'customer.delete': async (e, a) => {
        let c = await Customer.destroy({ where: { id: a.customer } });
        return { success: true, payload: parseResult(c) };
    },
    'customer.getAll': async (e, a) => {
        let c = await Customer.findAll({ where: { [Op.not]: { id: 1 } } });
        return { success: true, payload: parseResult(c) };
    },
    'provider.create': async (e, a) => {
        let p = await Provider.create(a.provider);
        return { success: true, payload: parseResult(p) };
    },
    'provider.update': async (e, a) => {
        let p = await Provider.update(a.provider, { where: { id: a.provider } });
        return { success: true, payload: parseResult(p) };
    },
    'provider.delete': async (e, a) => {
        let p = await Provider.destroy({ where: { id: a.provider } });
        return { success: true, payload: parseResult(p) };
    },
    'provider.getAll': async (e, a) => {
        let p = await Provider.findAll({ where: { [Op.not]: { id: 1 } } });
        return { success: true, payload: parseResult(p) };
    },
    'sale.create': async (e, a) => {
        a.sale.ClientId = session.user.parent ? session.user.parent : session.user.Client.id;
        if (!a.sale.CustomerId) {
            a.sale.CustomerId = 1;
        }
        a.sale.cashierId = session.user.id;
        a.sale.cashdrawerId = session.cashDrawer.id;
        let o = await Order.create(a.sale, { include: [Order.belongsTo(Client), Order.hasMany(OrderItem), Order.hasMany(Payment)] });
        return { success: true, payload: parseResult(o) };
    },

}

async function APIHandler(e, a) {
    /**
     *  @param {Event} e - The event that triggered the handler
     * @param {Object} a - The arguments passed to the handler
     * @property {Boolean} success - Whether the operation was successful
     * @property {Object} payload - The result of the operation
     * @property {String} error - The error message
     * @returns {Object} - The result of the operation
     */
    if (a.request in api) {
        try {
            return await api[a.request](e, a);
        } catch (error) {
            return { success: false, error: error };
        }
    }
}

module.exports = APIHandler;