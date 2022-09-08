'use strict';
const {
  Model, DataTypes
} = require('sequelize');

var bcrypt = require('bcryptjs');
module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    firstName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: {
            msg: "A first name is required"
          }
        }
    },
    lastName:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
          notNull: {
            msg: "A last name is required"
          }
        }
    },
    emailAddress:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'Email address already in use!'
        },
        isEmail: true,
        validate:{
          notNull: {
            msg: "An email address is required"
          },
          isEmail: {
            msg: 'Please provide a valid email address'
          }
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password is required'
          }
        }
    },
}, {
    sequelize
  });
    User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      },
    });
  };
  return User;
};