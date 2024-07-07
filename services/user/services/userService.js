const UserRepository = require('../repositories/userRepository');
const RoleRepository = require('../../role/repositories/roleRepository');
const LogRepository = require('../../log/repositories/logRepository');
const cacheService = require('../../cache/services/cacheService');
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const emailService = require('../../email/services/emailService');
require('dotenv').config();

const userRepository = new UserRepository();
const roleRepository = new RoleRepository();
const logRepository = new LogRepository();

// Tüm kullanıcıları getirme (filtreleme, sıralama, limit ve sayfalama ile)
const getUsers = async (filters, options) => {
    const { sortField, sortOrder, limit, page, globalFilter } = options;
    const query = {};
  
    // Global filter için OR sorgusu
    if (globalFilter) {
      query.$or = [
        { username: { $regex: globalFilter, $options: 'i' } },
        { email: { $regex: globalFilter, $options: 'i' } },
        { role: { $regex: globalFilter, $options: 'i' } }
      ];
    }
  
    // Diğer filtreleri ekle
    Object.assign(query, filters);
  
    const userQuery = User.find(query);
  
    if (sortField && sortOrder) {
      const sort = {};
      sort[sortField] = sortOrder === 'desc' ? -1 : 1;
      userQuery.sort(sort);
    }
  
    if (limit) {
      const pageNumber = page || 1;
      userQuery.skip((pageNumber - 1) * limit).limit(limit);
    }
  
    const users = await userQuery.exec();
    const total = await User.countDocuments(query);
  
    return { users, total, page: page || 1, limit };
  };
  

const getUserById = async (id) => {
    let user = cacheService.getCache(`user_${id}`);
    if (user) {
        return user;
    }
    user = await userRepository.getUserById(id);
    if (user) {
        cacheService.setCache(`user_${id}`, user);
    }
    return user;
};

const createUser = async (user, createdBy) => {
    const role = await roleRepository.getRoleByName(user.role);
    if (!role) {
        throw new Error('Invalid role');
    }
    user.role = role._id;
    user.createdBy = createdBy;
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    const newUser = await userRepository.createUser(user);

    await logRepository.createLog({
        action: 'createUser',
        user: createdBy,
        details: `User ${newUser.name} created`
    });

    // Cache'i güncelle
    cacheService.setCache(`user_${newUser._id}`, newUser);

    return newUser;
};

const updateUser = async (id, user, updatedBy) => {
    const role = await roleRepository.getRoleByName(user.role);
    if (!role) {
        throw new Error('Invalid role');
    }
    // Şifre alanını kaldır
    if (updateData.password) {
        delete updateData.password;
    }

    user.role = role._id;
    user.updatedBy = updatedBy;
    const updatedUser = await userRepository.updateUser(id, user);

    await logRepository.createLog({
        action: 'updateUser',
        user: updatedBy,
        details: `User ${updatedUser.name} updated`
    });
    // Cache'i güncelle
    cacheService.setCache(`user_${id}`, user);
    return updatedUser;
};

const authenticate = async (email, password) => {
    const user = await userRepository.getUserWithPasswordByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
  
    return user;
  };

const filterUsers = async (filters) => {
    return await userRepository.filterUsers(filters);
};

const requestPasswordReset = async (email) => {
    const user = await userRepository.getUserByEmail(email);
    console.log(user, email)
    if (!user) {
        throw new Error('User not found');
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

    await user.save();

    // Cache'i güncelle
  cacheService.setCache(`user_${user._id}`, user);

    const resetLink = `${process.env.APPURL}/reset/${token}`;
    await emailService.sendPasswordResetEmail(user.email, resetLink);
};

const resetPassword = async (token, newPassword) => {
    const user = await userRepository.getUserByResetToken(token);
    if (!user || user.resetPasswordExpires < Date.now()) {
        throw new Error('Password reset token is invalid or has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    // Cache'i güncelle
    cacheService.setCache(`user_${user._id}`, user);

    // Sunucunun yerel saatini almak için
    const currentTime = new Date();
    const timeZoneOffset = -currentTime.getTimezoneOffset() / 60;
    const offsetSign = timeZoneOffset >= 0 ? '+' : '-';
    const formattedOffset = `${offsetSign}${Math.abs(timeZoneOffset).toString().padStart(2, '0')}:00`;

    const resetTime = `${currentTime.toUTCString()} (GMT${formattedOffset})`;
    await emailService.sendPasswordChangedEmail(user.email, resetTime);
};

const deleteUser = async (id) => {
    const deletedUser = await userRepository.deleteUser(id);
  
    await logRepository.createLog({
      action: 'deleteUser',
      user: id,
      details: `User ${deletedUser.name} deleted`
    });
  
    // Cache'i temizle
    cacheService.deleteCache(`user_${id}`);
  
    return deletedUser;
  };

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    authenticate,
    filterUsers,
    requestPasswordReset,
    resetPassword,
    deleteUser
};