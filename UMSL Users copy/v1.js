const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const request = require('request');

const userTypes = [
  'student',
  'admin'
];

const authMiddleware = require('./authMiddleware.js');

const User = require('../../models/user.js');
const Submission = require('../../models/submission.js');
const Project = require('../../models/project.js');

const isNumeric = value => /^-{0,1}\d+$/.test(value);

const validateEmail = email => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

const validateStudentID = studentID => {
  if (studentID.length > 7 || studentID.length < 7 || !isNumeric(studentID)) {
    return false;
  } else {
    if (studentID.slice(0, 4) === '2019' || studentID.slice(0, 4) === '2020' || studentID.slice(0, 4) === '2021' || studentID.slice(0, 4) === '2022') {
      return true;
    } else {
      return false;
    }
  }
};

const studentLoginSuccessRedirect = '/dashboard';

router.get('/test', authMiddleware.protectedAdmin, (req, res, next) => {
  res.status(200).json({
    'hey': 'hi'
  });
});

router.post('/auth', (req, res, next) => {
  // if already logged in, redirect to dashboard
  if (req.session.loggedIn) {
    if (req.session.userType === 'student') {
      res.status(200).json({
        success: true,
        loggedIn: true,
        userType: 'student',
        redirectTo: studentLoginSuccessRedirect
      });
    } else if (req.session.userType === 'admin') {
      res.status(200).json({
        success: true,
        loggedIn: true,
        userType: 'admin',
        redirectTo: '/admin'
      });
    } else {
      // unknown user_type
      req.session.loggedIn = false;
      res.status(200).json({
        success: true,
        loggedIn: false,
        redirectTo: '/login'
      });
    }
  } else {
    if (req.body.email && req.body.password) {
      User.find({
        email: req.body.email
      }).then(doc => {
        if (doc.length > 0 && doc[0].password && doc[0].user_type && userTypes.indexOf(doc[0].user_type) !== -1) {
          bcrypt.compare(req.body.password, doc[0].password, (err, result) => {
            if (result) {
              req.session.email = doc[0].email;
              req.session.userType = doc[0].user_type;
              req.session.firstName = doc[0].first_name;
              req.session.lastName = doc[0].last_name;
              req.session.loggedIn = true;
              // console.log(doc[0]);
              if (doc[0].user_type === 'student') {
                res.status(200).json({
                  success: true,
                  loggedIn: true,
                  userType: 'student',
                  redirectTo: studentLoginSuccessRedirect
                });
              } else if (doc[0].user_type === 'admin') {
                res.status(200).json({
                  success: true,
                  loggedIn: true,
                  userType: 'admin',
                  redirectTo: '/admin'
                });
              }
            } else {
              // Login fail due to incorrect password
              req.session.loggedIn = false;
              res.status(200).json({
                success: true,
                loggedIn: false,
                message: 'Login unsuccessful: unknown email or password',
                redirectTo: '/login'
              });
            }
            if (err) {
              console.error(err);
              req.session.loggedIn = false;
              res.status(500).json({
                success: false,
                loggedIn: false,
                error: 'Internal server error',
                redirectTo: '/login'
              });
            }
          });
        } else {
          // No user
          req.session.loggedIn = false;
          res.status(200).json({
            success: true,
            loggedIn: false,
            message: 'Login unsuccessful: unknown email or password',
            redirectTo: '/login'
          });
        }
      });
    } else {
      // correct body not supplied
      res.status(400).json({
        success: false,
        loggedIn: false,
        error: 'Correct body not supplied',
        redirectTo: '/login'
      });
    }
  }
});

router.post('/register', (req, res, next) => {
  if (req.session.loggedIn) {
    if (req.session.userType === 'student') {
      res.status(200).json({
        success: true,
        registered: false,
        loggedIn: true,
        userType: 'student',
        redirectTo: studentLoginSuccessRedirect
      });
    } else if (req.session.userType === 'admin') {
      res.status(200).json({
        success: true,
        registered: false,
        loggedIn: true,
        userType: 'admin',
        redirectTo: '/admin'
      });
    } else {
      // unknown user_type
      req.session.loggedIn = false;
      res.status(200).json({
        success: true,
        registered: false,
        loggedIn: false,
        redirectTo: '/login'
      });
    }
  } else {
    if (req.body.email && req.body.firstName && req.body.lastName && req.body.studentId && req.body.password && req.body.passwordConfirm) {
      // validation
      if (validateEmail(req.body.email) && validateStudentID(req.body.studentId) && req.body.password === req.body.passwordConfirm) {
        // check if user with email exists
        User.find({
          email: req.body.email
        }).then(doc => {
          if (doc.length > 0) {
            // user already exists
            res.status(200).json({
              success: true,
              registered: false,
              loggedIn: false,
              error: 'User already exists',
              redirectTo: '/register'
            });
          } else {
            // create user in database
            // hash password
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                console.error(err);
                res.status(500).json({
                  success: false,
                  registered: false,
                  loggedIn: false,
                  error: 'Internal server error'
                });
              } else {
                // put user in database
                const newUser = new User({
                  email: req.body.email,
                  password: hash,
                  first_name: req.body.firstName,
                  last_name: req.body.lastName,
                  student_id: req.body.studentId,
                  grad_year: req.body.studentId.slice(0, 4),
                  user_type: 'student'
                });
                newUser.save().then(doc => {
                  // user creation successful
                  req.session.loggedIn = true;
                  req.session.email = req.body.email;
                  req.session.firstName = req.body.firstName;
                  req.session.lastName = req.body.lastName;
                  req.session.userType = 'student';
                  res.status(200).json({
                    success: true,
                    registered: true,
                    loggedIn: true,
                    redirectTo: studentLoginSuccessRedirect
                  });                  
                }).catch(err => {
                  console.error(err);
                  res.status(500).json({
                    success: false,
                    registered: false,
                    loggedIn: false,
                    error: 'Internal server error',
                    redirectTo: '/register'
                  });
                });
              }
            });
          }
        });
      } else {
        res.status(200).json({
          success: false,
          registered: false,
          loggedIn: false,
          error: 'Validation error',
          redirectTo: '/register'
        });
      }
    } else {
      // missing fields, bad request
      res.status(400).json({
        success: false,
        registered: false,
        loggedIn: false,
        error: 'Correct body not supplied',
        redirectTo: '/register'
      });
    }
  }
});

router.get('/logout', (req, res, next) => {
  req.session.loggedIn = false;
  res.status(200).json({
    success: true,
    loggedIn: false,
    redirectTo: '/'
  });
});

router.post('/createproject', (req, res, next) => {
  if (req.session.loggedIn && req.session.userType === 'admin') {
    if (req.body.projectName && req.body.projectDescription && req.body.projectDeadline) {
      let newProject;
      if (req.body.projectLink) {
        newProject = new Project({
          name: req.body.projectName,
          description: req.body.projectDescription,
          url: req.body.projectLink,
          deadline: req.body.projectDeadline,
          creation_time: Math.round((new Date()).getTime() / 1000),
          last_modified: Math.round((new Date()).getTime() / 1000)
        });
      } else {
        newProject = new Project({
          name: req.body.projectName,
          description: req.body.projectDescription,
          deadline: req.body.projectDeadline,
          creation_time: Math.round((new Date()).getTime() / 1000),
          last_modified: Math.round((new Date()).getTime() / 1000)
        });
      }
      newProject.save().then(doc => {
        res.status(200).json({
          success: true,
          projectId: 'not yet',
          redirectTo: '/admin/projects'
        });
      }).catch(err => {
        console.error(err);
        const error = new Error('Internal server error');
        error.status = 500;
        next(error);
      });
    } else {
      const error = new Error('Bad request');
      error.status = 400;
      next(error);
    }
  } else {
    const error = new Error('Not authorized');
    error.status = 401;
    next(error);
  }
});

// Must keep at end of file
router.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

module.exports = router;
