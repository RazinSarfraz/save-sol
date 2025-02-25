const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/postgres');
const BaseModel = require('./baseModel');

class User extends BaseModel {}

User.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: false, unique: true },
    pinCode: { type: DataTypes.STRING, allowNull: true },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_enabled: { type: DataTypes.BOOLEAN, defaultValue: false },
    otp: { type: DataTypes.STRING, allowNull: true },
}, {
    sequelize,
    modelName: 'User'
});

module.exports = User;