const dotenv = require('dotenv');
dotenv.config();

const PORT = process.env.PORT || 3003;
const SECRET = process.env.APP_SECRET;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET
};
