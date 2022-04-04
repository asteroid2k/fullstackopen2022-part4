const supertest = require('supertest');
const app = require('../app');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/user');
const { rootUser, newUser, usersInDb, invalidUser } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const user = new User(rootUser);
  await user.save();
});
describe('user endpoints', () => {
  describe('fetching users', () => {
    test('users are returned as json', async () => {
      const response = await api.get('/api/users');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBeDefined();
    });
  });
  describe('adding users', () => {
    test('creation fails with a existing username', async () => {
      const exitingUser = rootUser;
      exitingUser.password = 'password';
      await api.post('/api/users').send(exitingUser).expect(400);
    });
    test('creation fails with a invalid username and password', async () => {
      await api.post('/api/users').send(invalidUser).expect(400);
    });

    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await usersInDb();
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const usersAtEnd = await usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

      const usernames = usersAtEnd.map((u) => u.username);
      expect(usernames).toContain(newUser.username);
    });
  });
}, 10000);

afterAll(() => {
  mongoose.connection.close();
});
