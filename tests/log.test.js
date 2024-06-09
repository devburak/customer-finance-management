const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Log = require('../services/log/models/logModel'); // Log modelinin yolu

let adminToken;

describe('Log API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Admin kullanıcısı ile oturum açma
    const res = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@example.com',
        password: '1234Admin'
      });

    adminToken = res.body.token;
  });

  beforeEach(async () => {
    await Log.deleteMany({}); // Her testten önce logları temizleyin
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should get all logs', async () => {
    // Örnek bir log oluşturma
    await new Log({
      action: 'Test Action',
      user: new mongoose.Types.ObjectId(),
      details: 'This is a test log'
    }).save();

    const res = await request(app)
      .get('/api/logs')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.logs.length).toBeGreaterThan(0);
  });

  it('should filter logs', async () => {
    // Örnek bir log oluşturma
    await new Log({
      action: 'Test Action',
      user: new mongoose.Types.ObjectId(),
      details: 'This is a test log'
    }).save();

    const res = await request(app)
      .get('/api/logs/filter?action=Test Action')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.logs.length).toBeGreaterThan(0);
  });

  it('should delete a log by ID', async () => {
    const log = await new Log({
      action: 'Test Action',
      user: new mongoose.Types.ObjectId(),
      details: 'This is a test log'
    }).save();

    const res = await request(app)
      .delete(`/api/logs/${log._id}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(204);

    // Silindiğinden emin olmak için logu kontrol edelim
    const deletedLog = await Log.findById(log._id);
    expect(deletedLog).toBeNull();
  });

  it('should delete logs by query', async () => {
    await new Log({
      action: 'Test Action',
      user: new mongoose.Types.ObjectId(),
      details: 'This is a test log'
    }).save();

    const res = await request(app)
      .delete('/api/logs')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ action: 'Test Action' });

    expect(res.statusCode).toEqual(204);

    // Silindiğinden emin olmak için logları kontrol edelim
    const remainingLogs = await Log.find({ action: 'Test Action' });
    expect(remainingLogs.length).toEqual(0);
  });
});