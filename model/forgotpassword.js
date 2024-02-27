const Sequelize= require('sequelize')

const sequelize= require('../util/database')

const ForgotPassword= sequelize.define('forgotpassword',{
    id:{
        type: Sequelize.UUID,
        primaryKey:true,
        allowNull:false
    },
    isactive:Sequelize.BOOLEAN
})

module.exports=ForgotPassword;