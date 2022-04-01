const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");
const mongoose = require("mongoose");

const server = http.createServer(app);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.info("connected"))
  .catch((error) => logger.error(error));

server.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
