const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    validPassword(user_password) {
      return bcrypt.compare(user_password, this.user_password);
    }
  }
  User.init(
    {
      user_name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "Please enter a valid email addresss" },
        },
        isEmail: true,
      },
      user_phone: {
        type: DataTypes.STRING,
      },
      user_password: DataTypes.STRING,
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.JSON,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      hooks: {
        beforeCreate: (user) => {
          user.user_password = bcrypt.hashSync(user.user_password, saltRounds);
        },
      },
      instanceMethods: {
        validatePassword: (user_password) => {
          return bcrypt.compare(user_password, this.user_password);
        },
      },
      sequelize,
      modelName: "user",
    }
  );
  User.associate = function (models) {
    User.hasMany(models.Blog);
    User.hasMany(models.Address);
    User.belongsToMany(models.Service, {
      as: "User",
      foreignKey: "user_serviceId",
      through: "Resource",
    });
  };
  return User;
};
