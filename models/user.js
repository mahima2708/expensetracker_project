const sequelize = require('sequelize');
const database = require('../util/userdatabase');
const  userlist= database.define('users',{
    id:{
        type: sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: sequelize.STRING,
    emailid:{
        type:sequelize.STRING,
        unique: true,
    },
    password: sequelize.STRING
});

module.exports= userlist;