const bcrypt = require('bcryptjs');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    url: 1,
    likes: 1
  });
  response.json(users);
});

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body;
  const passwordVal = password && password.length >= 3;

  if (!passwordVal) {
    return response
      .status(400)
      .json({ error: 'Password must be at least 3 characters' });
  }
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return response.status(400).json({
      error: 'Username is taken'
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
});

module.exports = usersRouter;
