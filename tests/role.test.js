const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Role = require('../services/role/models/roleModel'); // Rol modelinin yolu
const User = require('../services/user/models/userModel'); // Kullanıcı modelinin yolu
const bcrypt = require('bcryptjs');

let adminToken;

describe('Role API', () => {
  beforeAll(async () => {
    try {
      await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

      // Admin kullanıcısının var olup olmadığını kontrol et, yoksa oluştur
      let adminUser = await User.findOne({ email: 'admin@example.com' });
      if (!adminUser) {
        const hashedPassword = await bcrypt.hash('1234Admin', 10);
        adminUser = new User({
          name: 'Admin',
          email: 'admin@example.com',
          password: hashedPassword,
          role: 'admin' // Bu, role referansı olmalı, role ID'si ile değiştirilmesi gerekebilir
        });
        await adminUser.save();
      }

      // Admin kullanıcısı ile oturum açma
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'admin@example.com',
          password: '1234Admin'
        });

      console.log('Login response:', res.body); // Login yanıtını kontrol et

      if (res.statusCode !== 200) {
        throw new Error(`Login failed: ${res.body.message}`);
      }

      adminToken = res.body.token;
      console.log("admin token:",adminToken)
    } catch (error) {
      console.error('Error setting up beforeAll:', error);
      throw error; // Hatanın Jest tarafından yakalanmasını sağlar
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new role', async () => {
    try {
      const res = await request(app)
        .post('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Role'
        });

      console.log('Create role response:', res.body); // Rol oluşturma yanıtını kontrol et

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('name', 'Test Role');
    } catch (error) {
      console.error('Error in create role test:', error);
      throw error;
    }
  });

  it('should get all roles', async () => {
    try {
      const res = await request(app)
        .get('/api/roles')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error in get all roles test:', error);
      throw error;
    }
  });

  it('should update a role', async () => {
    try {
      const role = await Role.findOne({ name: 'Test Role' });
      const res = await request(app)
        .put(`/api/roles/${role._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Test Role'
        });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('name', 'Updated Test Role');
    } catch (error) {
      console.error('Error in update role test:', error);
      throw error;
    }
  });

  it('should delete a role', async () => {
    try {
      const role = await Role.findOne({ name: 'Updated Test Role' });
      const res = await request(app)
        .delete(`/api/roles/${role._id}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(res.statusCode).toEqual(204);
    } catch (error) {
      console.error('Error in delete role test:', error);
      throw error;
    }
  });
});