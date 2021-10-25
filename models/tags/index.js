const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    "tag",
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
  SequelizeSlugify.slugifyModel(Tag, {
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
  Tag.associate = function (models) {
    Tag.belongsToMany(models.Tag, {
      as: "Tag",
      foreignKey: "tagId",
      through: "TagParents",
    });
    Tag.belongsToMany(models.Tag, {
      as: "Parent",
      foreignKey: "parentId",
      through: "TagParents",
    });
    Tag.belongsToMany(models.Blog, {
      through: "BlogTag",
    });
  };
  return Tag;
};
