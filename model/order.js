const Sequelize= require('sequelize')

const sequelize= require('../util/database')

const Order= sequelize.define('order',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    orderid:Sequelize.STRING,
    status:Sequelize.STRING,
    paymentid: Sequelize.STRING
})

module.exports=Order;