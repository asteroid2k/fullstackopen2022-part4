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
  errorHandler
} = require('./utils/middleware');

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.get('', (req, res) => {
  res.send('ok');
});

app.use('/api/blogs', blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info('connected'))
  .catch((error) => logger.error(error));

module.exports = app;
