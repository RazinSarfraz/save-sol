const { User } = require("../models");

class UserRepository {
  async findByPhone(phone) {
    return await User.findOne({ where: { phone } });
  }

  async createUser(data) {
    return await User.create(data);
  }

  async updateUser(phone, data) {
    return await User.update(data, { where: { phone } });
  }

  async deleteUser(phone) {
    return await User.destroy({ where: { phone } });
  }
}

module.exports = new UserRepository();
