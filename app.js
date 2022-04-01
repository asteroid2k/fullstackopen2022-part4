const express = require("express");
const app = express();
const cors = require("cors");
const blogsRouter = require("./controllers/blog");
const {
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./utils/middleware");

app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.get("", (req, res) => {
  res.send("ok");
});

app.use("/api/blogs", blogsRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
