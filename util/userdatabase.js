const sequelize = require('sequelize');
const database = new sequelize('trackers','root','root',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports= database;