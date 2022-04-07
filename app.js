const express = require('express');
const mongoose = require('mongoose');
require('express-async-errors');

const config = require('./utils/config');
const logger = require('./utils/logger');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blog');
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
} = require('./utils/middleware');
const usersRouter = require('./controllers/user');
const loginRouter = require('./controllers/login');

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.get('', (req, res) => {
  res.send('ok');
});
app.use(tokenExtractor);

app.use('/api/blogs', userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected'))
  .catch((error) => logger.error(error));

module.exports = app;
