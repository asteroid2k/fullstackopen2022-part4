const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  let { user } = request;

  if (!user) {
    return response.sendStatus(401);
  }

  const { title, likes, url, author } = request.body;

  const blog = new Blog({
    title,
    likes,
    url,
    author,
    user: user._id
  });

  const result = await blog.save();
  user.blogs = user.blogs.concat(result._id);
  await user.save();
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
  const { user } = request;
  const { id } = request.params;
  const blog = await Blog.findById(id).populate('user');
  if (!blog) {
    return response.sendStatus(404);
  }
  if (!user || user._id.toString() !== blog.user._id.toString()) {
    return response.sendStatus(401).json({ error: 'Must be author' });
  }
  await blog.remove();
  return response.sendStatus(204);
});

module.exports = blogsRouter;
