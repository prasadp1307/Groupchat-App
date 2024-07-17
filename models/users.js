const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Users = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    number: {
        type: Sequelize.STRING,  // Changed from INTEGER to STRING
        allowNull: false
    }
});

module.exports = Users;
