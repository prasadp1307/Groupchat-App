const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const Group = sequelize.define('Group', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        // allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    inviteLink: {
        type: Sequelize.STRING,
        allowNull: false
    },
    memberCount: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Group;
