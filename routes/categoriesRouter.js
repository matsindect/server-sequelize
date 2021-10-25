const express = require("express");
const authController = require("./../controllers/authController");
const categoriesController = require("../controllers/categories");

const router = express.Router();

router
  .route("/")
  .post(authController.protect, categoriesController.createCategory)
  .get(categoriesController.getCategories);

router
  .route("/:id")
  .get(categoriesController.getCategory)
  .delete(categoriesController.deleteCategory);

module.exports = router;
