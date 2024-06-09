const User = require('../models/userModel');

class UserRepository {
  async getAllUsers() {
    return await User.find().populate('role').populate('createdBy').populate('updatedBy');
  }

  async getUserById(id) {
    return await User.findById(id).populate('role').populate('createdBy').populate('updatedBy');
  }

  async getUserByEmail(email) {
    const user= await User.findOne({ email }).populate('role').populate('createdBy').populate('updatedBy');
    console.log("user:" , user)
    return user;
  }
   // Yeni fonksiyon: Şifreyi de dahil ederek kullanıcıyı getirme
   async getUserWithPasswordByEmail(email) {
    const user= await User.findOne({ email }).select('+password').populate('role').populate('createdBy').populate('updatedBy');
    console.log(user)
    return user;
  }

  async createUser(user) {
    const newUser = new User(user);
    return await newUser.save();
  }

  async updateUser(id, user) {
    return await User.findByIdAndUpdate(id, user, { new: true });
  }

  async deleteUser(id) {
    return await User.findByIdAndDelete(id);
  }

  async filterUsers(filters) {
    const query = {};
    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' }; // Case-insensitive regex
    }
    if (filters.role) {
      const role = await Role.findOne({ name: filters.role });
      if (role) {
        query.role = role._id;
      }
    }
    if (filters.createdDate) {
      query.createdAt = { $gte: new Date(filters.createdDate) };
    }
    return await User.find(query).populate('role').populate('createdBy').populate('updatedBy');
  }

  async getUserByResetToken(token) {
    return await User.findOne({ resetPasswordToken: token });
  }
}

module.exports = UserRepository;