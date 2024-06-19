const express = require('express')
const Router = express.Router();
const user = require('../controller/user')
const passport = require('passport');

Router.get('/register', user.sendRegisterForm)

Router.post('/register', user.register)

Router.get('/login', user.renderLoginForm)

Router.post('/login', passport.authenticate('local', {failureFlash : true, failureRedirect : '/login'}), user.Login)

Router.get('/logout' , user.logout)

module.exports = Router