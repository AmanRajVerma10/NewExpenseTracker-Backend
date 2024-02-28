const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const filesdownloaded = sequelize.define("filesdownloaded", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  fileurl: Sequelize.STRING,
});

module.exports = filesdownloaded;
