const path = require("path");
const bodyParser = require("body-parser");
const express = require("express");
const ratelimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");

const AppError = require("./utils/appError");
const uniErrorHamndler = require("./controllers/erroController");

const server = express();

// http security
server.use(helmet());

// Serving static files
server.use(cors());
server.use(express.static(path.join(__dirname, "public")));
// server.use(bodyParser.json());
//limit number of api request to 100
const limiter = ratelimit({
  max: 100000,
  windowMs: 60 * 60 * 1000,
  message: "You have exceeded the number of request, Try in an hour",
});

const userRouter = require("./routes/userRouter");
const blogsRouter = require("./routes/blogsRouter");
const categoriesRouter = require("./routes/categoriesRouter");

//body parser
server.use(bodyParser.json({ limit: "1000mb" }));

//Data sanitization
server.use(xss());

// Prevent parameter polution
server.use(hpp());

server.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

//ROUTES;
server.use("/api/v1/users", userRouter);
server.use("/api/v1/blogs", blogsRouter);
server.use("/api/v1/categories", categoriesRouter);

server.all("*", (req, res, next) => {
  next(new AppError(`Cannot Find ${req.originalUrl} on this server`, 404));
});

server.use(uniErrorHamndler);

module.exports = server;
