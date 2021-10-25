const { Category, Blog, User } = require("./../../models");
const catchAsyncFunc = require("./../../utils/catchAsyncFuncs");

exports.getCategories = catchAsyncFunc(async (req, res, next) => {
  const attributes = [
    "id",
    "slug",
    "name",
    "description",
    "featuredImage",
    "is_active",
  ];
  const result = await Category.findAll({
    include: [
      {
        model: Category,
        as: "Parent",
        attributes: attributes,
        through: {
          attributes: [],
        },
      },
    ],
  });

  res.status(201).send({
    status: "success",
    category: result,
  });
});
exports.getCategory = catchAsyncFunc(async (req, res, next) => {
  const attributes = [
    "id",
    "slug",
    "name",
    "description",
    "featuredImage",
    "is_active",
  ];
  const result = await Category.findOne({
    where: { id: req.params.id },
    include: [
      {
        model: Category,
        as: "Parent",
        attributes: attributes,
        through: {
          attributes: [],
        },
      },
    ],
  });

  res.status(201).send({
    status: "success",
    category: result,
  });
});

exports.createCategory = catchAsyncFunc(async (req, res, next) => {
  if (req.body.id) {
    const result = await Category.findOne({ where: { id: req.body.id } });

    if (result) {
      result.name = req.body.name ? req.body.name : result.name;
      result.description = req.body.description
        ? req.body.description
        : result.description;
      result.featuredimage = req.body.featuredimage
        ? req.body.featuredimage
        : result.featuredimage;
      result.is_active = req.body.is_active
        ? req.body.is_active
        : result.is_active;
      await result.addParent(req.body.parents);
      await result.save();
      res.status(201).send({
        status: "success",
        category: result,
      });
    }
  } else {
    const category = await Category.create({
      name: req.body.name,
      description: req.body.description,
      featuredimage: req.body.featuredimage,
    });

    if (req.body.parents.length > 0) category.setParent(req.body.parents);

    if (category) {
      res.status(201).send({
        status: "success",
        category,
      });
    }
  }
});

exports.deleteCategory = catchAsyncFunc(async (req, res, next) => {
  const result = await Category.findOne({ where: { id: req.params.id } });
  if (result) {
    await Category.destroy({ where: { id: req.params.id } });
    res.status(201).send({
      status: "success",
      category: result.id,
    });
  }
});
