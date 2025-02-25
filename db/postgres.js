const { Sequelize } = require('sequelize');
const fs = require('fs');
const logStream = fs.createWriteStream('./logs/sequelize.log', { flags: 'a' });

const sequelize = new Sequelize(
    process.env.PG_DATABASE,
    process.env.PG_USER,
    process.env.PG_PASSWORD,
    {
        host: process.env.PG_HOST,
        dialect: 'postgres',
        logging: msg => logStream.write(msg + '\n') // Write logs to a file
    }
);

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully!');
    } catch (error) {
        console.error('❌ Database connection error:', error);
    }
};

module.exports = { sequelize, connectDB };
