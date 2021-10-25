const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define(
    "category",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      description: {
        type: DataTypes.STRING,
      },
      featuredImage: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {}
  );
  SequelizeSlugify.slugifyModel(Category, {
    source: ["name"],
    suffixSource: [],
    slugOptions: {
      replacement: "-",
      replaceSymbols: true,
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    },
    overwrite: true,
    column: "slug",
    incrementalSeparator: "-",
    passTransaction: true,
    paranoid: true,
    bulkUpdate: false,
  });
  Category.associate = function (models) {
    Category.belongsToMany(models.Category, {
      as: "Category",
      through: "CategoryParents",
      foreignKey: "subcategoryId",
    });
    Category.belongsToMany(models.Category, {
      as: "Parent",
      through: "CategoryParents",
      foreignKey: "parentId",
    });
    Category.belongsToMany(models.Blog, {
      through: "BlogCategory",
    });
    Category.belongsToMany(models.Service, {
      as: "ServicesCategory",
      through: "CategoryService",
      foreignKey: "categoriesId",
    });
  };
  return Category;
};
