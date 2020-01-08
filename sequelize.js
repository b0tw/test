const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;