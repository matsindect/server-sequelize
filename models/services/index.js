const SequelizeSlugify = require("sequelize-slugify");
module.exports = (sequelize, DataTypes) => {
  const Service = sequelize.define(
    "service",
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
  SequelizeSlugify.slugifyModel(Service, {
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
  Service.associate = function (models) {
    Service.belongsToMany(models.Service, {
      as: "Service",
      through: "ServiceParents",
      foreignKey: "subserviceId",
    });
    Service.belongsToMany(models.Service, {
      as: "Parent",
      through: "ServiceParents",
      foreignKey: "parentId",
    });
    Service.belongsToMany(models.Blog, {
      through: "BlogService",
    });
    Service.belongsToMany(models.Category, {
      as: "ServiceGroup",
      foreignKey: "servicesId",
      through: "CategoryService",
    });
    Service.belongsToMany(models.User, {
      as: "ServiceResource",
      through: "Resource",
      foreignKey: "service_resourceId",
    });
  };
  return Service;
};
