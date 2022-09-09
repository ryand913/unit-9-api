'use strict';
const {
  Model, DataTypes
} = require('sequelize');
module.exports = (sequelize) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  }
  Course.init({
    title:{
        type: DataTypes.STRING,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: 'A title is required'
          },
          notEmpty: {
            msg: 'Please provide a title'
          }
        }

    },
    description:{
        type: DataTypes.TEXT,
        allowNull: false,
        notEmpty: true,
        validate: {
          notNull: {
            msg: 'A description is required'
          },
          notEmpty: {
            msg: 'Please provide a description'
          }
        }
    },
    estimatedTime:{
        type: DataTypes.STRING
    },
    materialsNeeded:{
        type: DataTypes.STRING
    },
  }, {
    sequelize,
  });
  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: {
        fieldName: 'userId',
      },
    });
  };
  return Course;
};