module.exports = (sequelize, DataTypes) => {
  const Resource = sequelize.define(
    "Resource",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
        allowNull: false,
      },
      user_serviceId: {
        type: DataTypes.UUID,
        // primaryKey: true,
        foreignKey: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      service_resourceId: {
        type: DataTypes.UUID,
        foreignKey: true,
        references: {
          model: "services",
          key: "id",
        },
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {}
  );

  Resource.associate = function (models) {};
  return Resource;
};
