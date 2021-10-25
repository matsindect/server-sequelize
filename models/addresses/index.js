module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define(
    "Address",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV1,
        primaryKey: true,
      },
      address_1: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      address_2: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      postcode: {
        type: DataTypes.STRING,
      },
      comment: {
        type: DataTypes.STRING,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {}
  );

  Address.associate = function (models) {
    Address.belongsTo(models.User);
  };
  return Address;
};
