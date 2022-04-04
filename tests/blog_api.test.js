const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const {
  initialBlogs,
  newBlog,
  blogsInDb,
  generateToken,
  rootUser
} = require('./test_helper');

const api = supertest(app);
let TOKEN = '';
beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});
  const user = new User(rootUser);
  const saved = await user.save();
  const blogsWithUser = initialBlogs.map((blog) => ({
    ...blog,
    user: saved._id
  }));
  await Blog.insertMany(blogsWithUser);
  TOKEN = generateToken(saved.toJSON());
});

describe('blogs endpoints', () => {
  describe('fetching blogs', () => {
    test('blogs are returned as json', async () => {
      const response = await api.get('/api/blogs');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].id).toBeDefined();
    });
  });
  describe('adding blogs', () => {
    test('blogs are not saved without token', async () => {
      const response = await api.post('/api/blogs').send(newBlog);
      expect(response.status).toBe(401);
    });
    test('blogs are saved properly', async () => {
      const response = await api
        .post('/api/blogs')
        .set({ Authorization: 'Bearer ' + TOKEN })
        .send(newBlog);
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();

      const blogs = await blogsInDb();

      expect(blogs).toHaveLength(initialBlogs.length + 1);
    });
    test('new blog likes default to Zero', async () => {
      const testBlog = newBlog;
      delete testBlog.likes;
      const response = await api
        .post('/api/blogs')
        .set({ Authorization: 'Bearer ' + TOKEN })
        .send(testBlog);
      expect(response.body.likes).toBe(0);
    });
    test('new blog without title or url are rejected', async () => {
      const testBlog = { title: 'Yolo' };
      const response = await api
        .post('/api/blogs')
        .set({ Authorization: 'Bearer ' + TOKEN })
        .send(testBlog);
      expect(response.status).toBe(400);
    });
  });
  describe('editing blogs', () => {
    test('update likes', async () => {
      const blogs = await blogsInDb();

      const response = await api
        .put(`/api/blogs/${blogs[0].id}`)
        .send({ likes: 13 });
      expect(response.status).toBe(200);
      expect(response.body.likes).toBe(13);
    });
  });
  describe('deleting blogs', () => {
    test('invalid blog id', async () => {
      const response = await api
        .delete('/api/blogs/invalid')
        .set({ Authorization: 'Bearer ' + TOKEN });
      expect(response.status).toBe(400);
    });

    test('fail with valid blog id but no token', async () => {
      let blogs = await blogsInDb();
      const response = await api.delete(`/api/blogs/${blogs[0].id}`);
      expect(response.status).toBe(401);
    });
    test('valid blog id and token', async () => {
      let blogs = await blogsInDb();
      const response = await api
        .delete(`/api/blogs/${blogs[0].id}`)
        .set({ Authorization: 'Bearer ' + TOKEN });
      expect(response.status).toBe(204);
      blogs = await blogsInDb();
      expect(blogs).toHaveLength(initialBlogs.length - 1);
    });
  });
}, 10000);

afterAll(() => {
  mongoose.connection.close();
});
