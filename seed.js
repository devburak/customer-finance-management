const mongoose = require('mongoose');
const User = require('./services/user/models/userModel');
const Role = require('./services/role/models/roleModel');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seed = async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    let adminRole = await Role.findOne({ name: 'admin' });
    if (!adminRole) {
      adminRole = new Role({ name: 'admin' });
      await adminRole.save();
    }

    let adminUser = await User.findOne({ email: process.env.SEED_USER_EMAIL });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(process.env.SEED_USER_PASSWORD ||"1234Admin", 10);
      adminUser = new User({
        name:process.env.SEED_USER_NAME || "admin",
        email: process.env.SEED_USER_EMAIL ||'admin@example.com',
        password: hashedPassword,
        role: adminRole._id
      });
      await adminUser.save();
      console.log('Default admin user created');
    } else {
      console.log('Default admin user already exists');
    }
  } catch (error) {
    console.error(error);
  } finally {
    mongoose.connection.close();
  }
};

seed();