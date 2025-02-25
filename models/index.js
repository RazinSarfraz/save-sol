const { sequelize, connectDB } = require('../db/postgres');
const User = require('./user');



const initializeDB = async () => {
    try {
        await connectDB();
        await sequelize.sync({ alter: true });
        console.log('✅ Tables created');
    } catch (error) {
        console.error('❌ Database initialization error:', error);
    }
};

module.exports = { 
    sequelize, 
    User, 
    initializeDB
 };
