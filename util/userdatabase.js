const sequelize = require('sequelize');
require('dotenv').config();
const database = new sequelize('trackers',process.env.DB_DATA,process.env.DB_PASSWORD,{
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

module.exports= database;