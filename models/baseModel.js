const { Model, DataTypes } = require('sequelize');

class BaseModel extends Model {
    static init(attributes, options) {
        return super.init(
            {
                ...attributes,
                createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
                deletedAt: { type: DataTypes.DATE, allowNull: true }
            },
            {
                ...options,
                timestamps: true,
                paranoid: true
            }
        );
    }
}

module.exports = BaseModel;
