const Sequelize = require("sequelize");
const userModel = require("./users");
const Blogs = require("./blogs");
const Tags = require("./tags");
const Categories = require("./categories");
const Services = require("./services");
const Addresses = require("./addresses");
const Resources = require("./resources");

const sequelize = require("./dbConnect");
const models = {
  User: userModel(sequelize, Sequelize.DataTypes),
  Blog: Blogs(sequelize, Sequelize.DataTypes),
  Category: Categories(sequelize, Sequelize.DataTypes),
  Tag: Tags(sequelize, Sequelize.DataTypes),
  Service: Services(sequelize, Sequelize.DataTypes),
  Address: Addresses(sequelize, Sequelize.DataTypes),
  Resource: Resources(sequelize, Sequelize.DataTypes),
};

Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

module.exports = models;
