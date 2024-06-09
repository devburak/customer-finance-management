const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../services/user/models/userModel');
const Role = require('../services/role/models/roleModel');
const bcrypt = require('bcryptjs');

let adminToken;
let resetToken;

beforeAll(async () => {
  await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Admin rolünün var olup olmadığını kontrol et, yoksa oluştur
  let adminRole = await Role.findOne({ name: 'admin' });
  if (!adminRole) {
    adminRole = new Role({ name: 'admin' });
    await adminRole.save();
  }

  // Admin kullanıcısının var olup olmadığını kontrol et, yoksa oluştur
  let adminUser = await User.findOne({ email: 'admin@example.com' });
  if (!adminUser) {
    const hashedPassword = await bcrypt.hash('1234Admin', 10);
    adminUser = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: adminRole._id,
    });
    await adminUser.save();
  }

  // Admin kullanıcısı ile oturum açma
  const res = await request(app)
    .post('/api/users/login')
    .send({
      email: 'admin@example.com',
      password: '1234Admin',
    });

  adminToken = res.body.token;
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Management', () => {
  let userId;

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Burak',
        email: 'dev.burak@gmail.com',
        password: 'Burak1234',
        role: 'admin',
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    userId = res.body._id;
  });

  it('should request password reset', async () => {
    const res = await request(app)
      .post('/api/users/request-password-reset')
      .send({ email: 'dev.burak@gmail.com' });
    
    console.log("Password reset request response:", res.body);
    expect(res.statusCode).toEqual(200);

    const user = await User.findOne({ email: 'dev.burak@gmail.com' });
    console.log("User after password reset request:", user);
    expect(user.resetPasswordToken).toBeDefined();
    resetToken = user.resetPasswordToken;
  });

  it('should reset the password', async () => {
    const res = await request(app)
      .post(`/api/users/reset/${resetToken}`)
      .send({ password: 'NewBurak1234' });
      
    console.log("Password reset response:", res.body);
    expect(res.statusCode).toEqual(200);

    const user = await User.findOne({ email: 'dev.burak@gmail.com' }).select('+password');
    console.log("User after password reset:", user);
    const isMatch = await bcrypt.compare('NewBurak1234', user.password);
    expect(isMatch).toBe(true);
  });
});
