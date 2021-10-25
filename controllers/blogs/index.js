const { Blog, User, Category } = require("./../../models");
const catchAsyncFunc = require("./../../utils/catchAsyncFuncs");
const { Op } = require("sequelize");
const _ = require("underscore");

exports.getBlogs = catchAsyncFunc(async (req, res, next) => {
  const parent = "";
  const result = await Blog.findAll({
    include: [
      {
        model: User,
        as: "user",
      },
      {
        model: Category,
      },
    ],
  });

  res.status(201).send({
    status: "success",
    blog: result,
  });
});
exports.getBlog = catchAsyncFunc(async (req, res, next) => {
  const result = await Blog.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: User,
        as: "user",
      },
    ],
  });

  res.status(201).send({
    status: "success",
    blog: result,
  });
});

exports.createBlogs = catchAsyncFunc(async (req, res, next) => {
  if (req.body.id) {
    const result = await Blog.findOne({ where: { id: req.body.id } });

    if (result) {
      result.blog_title = req.body.blog_title
        ? req.body.blog_title
        : result.blog_title;
      result.blog_post = req.body.blog_post
        ? req.body.blog_post
        : result.blog_post;
      result.featuredimage = req.body.featuredimage
        ? req.body.featuredimage
        : result.featuredimage;
      result.is_active = req.body.is_active
        ? req.body.is_active
        : result.is_active;

      const category = req.body.categories
        ? req.body.categories
        : result.categories;
      await result.addCategories(category);
      await result.save();
      res.status(201).send({
        status: "success",
        blog: result,
      });
    }
  } else {
    const user = await User.findByPk(req.user.id);
    const blog = await user.createBlog({
      blog_title: req.body.blog_title,
      blog_post: req.body.blog_post,
      featuredimage: req.body.featuredimage,
    });

    const category = req.body.categories;
    await blog.setCategories(category);

    if (blog) {
      res.status(201).send({
        status: "success",
        blog,
      });
    }
  }
});

exports.deleteBlog = catchAsyncFunc(async (req, res, next) => {
  const result = await Blog.findOne({ where: { id: req.params.id } });
  if (result) {
    await Blog.destroy({ where: { id: req.params.id } });
    res.status(201).send({
      status: "success",
      blog: result.id,
    });
  }
});
