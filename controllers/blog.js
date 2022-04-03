const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, url, likes } = request.body;
  const blog = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, likes, url },
    {
      new: true
    }
  );
  response.status(200).json(blog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  await Blog.findByIdAndDelete(id);
  return response.sendStatus(204);
});

module.exports = blogsRouter;
