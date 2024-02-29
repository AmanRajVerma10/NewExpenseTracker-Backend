const {Sequelize}= require('sequelize')
require('dotenv').config();

const sequelize= new Sequelize("expense-tracker","root",process.env.MYSQL_PASSWORD,{
    dialect:'mysql',
    host:'localhost'
})

module.exports=sequelize;