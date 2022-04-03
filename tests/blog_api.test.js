const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const { initialBlogs, newBlog, blogsInDb } = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(initialBlogs);
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
    test('blogs are saved properly', async () => {
      const response = await api.post('/api/blogs').send(newBlog);
      expect(response.status).toBe(201);
      expect(response.body.id).toBeDefined();

      const blogs = await blogsInDb();

      expect(blogs).toHaveLength(initialBlogs.length + 1);
      expect(blogs).toContainEqual(response.body);
    });
    test('new blog likes default to Zero', async () => {
      const testBlog = newBlog;
      delete testBlog.likes;
      const response = await api.post('/api/blogs').send(testBlog);
      expect(response.body.likes).toBe(0);
    });
    test('new blog without title or url are rejected', async () => {
      const testBlog = { title: 'Yolo' };
      const response = await api.post('/api/blogs').send(testBlog);
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
      const response = await api.delete('/api/blogs/invalid');
      expect(response.status).toBe(400);
    });
    test('valid blog id', async () => {
      let blogs = await blogsInDb();
      const response = await api.delete(`/api/blogs/${blogs[0].id}`);
      expect(response.status).toBe(204);
      blogs = await blogsInDb();

      expect(blogs).toHaveLength(initialBlogs.length - 1);
    });
  });
}, 10000);

afterAll(() => {
  mongoose.connection.close();
});
