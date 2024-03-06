const {Sequelize}= require('sequelize')

const sequelize= new Sequelize(process.env.DB_NAME,process.env.DB_USERNAME,process.env.DB_PASSWORD,{
    dialect:'mysql',
    host:process.env.DB_HOST,
    // port:3306,
    // dialectOptions: {
    //     ssh: {
    //       host: '13.233.110.83', // SSH host
    //       port: 22, // SSH port (typically 22)
    //       username: 'ec2-user', // SSH username
    //       privateKey: 'C:\\Users\\Dell\\AWScredentials\\sharpenerdemo.pem' // Path to SSH private key file
    //     }
    //   }
})

module.exports=sequelize;