'use strict';

const express = require('express');
const router = express.Router();
const { User, Course } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');
const users = require('./models/users');

function asyncHandler(cb){
    return async(req, res, next) => {
      try {
        await cb(req, res, next)
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    }
  }

//retrieve currently logged in User
router.get('/users', authenticateUser, asyncHandler(async(req,res) =>{
    let users = 
    { id: req.currentUser.id,
      firstName: req.currentUser.firstName,
      lastName: req.currentUser.lastName,
      emailAddress: req.currentUser.emailAddress,
    };
    res.status(200).json(users)
}));

//create new User
router.post('/users', asyncHandler(async(req,res) => {
    try {
        await User.create(req.body);
        res.location("/").status(201).end();
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
    }));

//retrieve all courses
router.get('/courses', asyncHandler(async(req,res) =>{
  try{
    let courses = await Course.findAll({
      attributes:{exclude: ['createdAt', 'updatedAt']},
      include: {
        model: User,
        attributes:{exclude: ['createdAt', 'updatedAt', 'password']},
      }
      });
    res.status(200).json(courses);}
  catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//get a specific course
router.get('/courses/:id', asyncHandler(async(req,res) =>{
  let course = await Course.findByPk(req.params.id, {
    attributes:{exclude: ['createdAt', 'updatedAt']},
    include: {
      model: User,
      attributes:{exclude: ['createdAt', 'updatedAt', 'password']},
    }
  });
  if(course){
    res.status(200).json(course);
  } else {
    const err = new Error("The course does not exist");
    err.status = 404;
    next(err);
  }
}));

//add a new course
router.post('/courses', authenticateUser, asyncHandler(async(req,res) =>{
  try {
    await Course.create(req.body);
    let allCourses = await Course.findAll();
    let uriValue = allCourses.length
    res.status(201).location(`courses/${uriValue}`).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//update a course
router.put('/courses/:id',authenticateUser, asyncHandler(async(req,res) =>{
  let course = await Course.findByPk(req.params.id)
  try{
    if(course && req.currentUser.id === course.userId){

      course.title = req.body.title,
      course.description = req.body.description,
      course.estimatedTime = req.body.estimatedTime,
      course.materialsNeeded = req.body.materialsNeeded
      await course.update(req.body);
      res.status(204).end();
    }
    else if(course && req.currentUser.id !== course.userId){
      res.status(403).end();
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

//delete a specified course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req,res) =>{
  let course = await Course.findByPk(req.params.id);
  try{
  if(course && req.currentUser.id === course.userId){
    await course.destroy();
    res.status(204).end();
  }
  else if(course && req.currentUser.id !== course.userId){
    res.status(403).end();
  }
} catch(error){
  throw error
}
}));

module.exports = router;

