'use strict';
const {
  Model
} = require('sequelize');

var bcrypt = require('bcryptjs');
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
confirmedPassword: {
    type: DataTypes.STRING,
    allowNull: false,
    set(val) {
      if ( val === this.password ) {
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('confirmedPassword', hashedPassword);
      }
    },
    validate: {
      notNull: {
        msg: 'Both passwords must match'
      }
    }
  }
}, {
    sequelize,
    modelName: 'User',
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