const express = require("express");
const authController = require("./../controllers/authController");
const blogsController = require("../controllers/blogs");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, blogsController.createBlogs)
  .get(blogsController.getBlogs);

router
  .route("/:id")
  .get(blogsController.getBlog)
  .delete(blogsController.deleteBlog);

module.exports = router;
