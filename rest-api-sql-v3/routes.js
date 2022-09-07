'use strict';

const express = require('express');
const router = express.Router();
const { User } = require('./models');
const { authenticateUser } = require('./middleware/auth-user');

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

router.get('/users', authenticateUser, asyncHandler(async(req,res) =>{
    let users = req.currentUser;
    res.status(200).json(users)
}));

router.post('/users', asyncHandler(async(req,res) => {
    try {
        await User.create(req.body);
        res.location("/").status(201);
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error;
        }
      }
    }));


router.get('/courses', asyncHandler(async(req,res) =>{
  let users = req.currentUser;
  let course = req.currentCourse;
  res.status(200).json(users + course);
}));

router.get('/courses/:id', asyncHandler(async(req,res) =>{
  let users = req.currentUser;
  let course = req.currentCourse;
  res.status(200).json(users + course);
}));


router.post('/courses', authenticateUser,asyncHandler(async(req,res) =>{
  let users = req.currentUser;
  let course = req.currentCourse;
  res.status(200).json(users + course);
}));

router.put('/courses',authenticateUser, asyncHandler(async(req,res) =>{
  let users = req.currentUser;
  let course = req.currentCourse;
  res.status(200).json(users + course);
}));

router.delete('/courses/:id', authenticateUser, asyncHandler(async(req,res) =>{
  let users = req.currentUser;
  let course = req.currentCourse;
  res.status(200).json(users + course);
}));

module.exports = router;

