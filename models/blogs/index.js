const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "blog",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      slug: {
        type: DataTypes.STRING,
      },
      blog_title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      featuredimage: {
        type: DataTypes.JSON,
      },
      blog_post: {
        type: DataTypes.TEXT,
      },
      blog_excerpt: {
        type: DataTypes.TEXT,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {}
  );

  SequelizeSlugify.slugifyModel(Blog, {
    source: ["blog_title"],
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

  Blog.associate = function (models) {
    Blog.belongsTo(models.User);

    Blog.belongsToMany(models.Category, {
      through: "BlogCategory",
    });
    Blog.belongsToMany(models.Tag, {
      through: "BlogTags",
    });
  };
  return Blog;
};
