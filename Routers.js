var express = require('express');
var usersCtrl = require('./routes/usersCtrl');

// Router
exports.router = (function(){
    var Routers = express.Router();

    // Users Routes
    Routers.route('/users/register/').post(usersCtrl.register);
    Routers.route('/users/register/').get(function(req,res){
        res.render('register.ejs');
    });
    
    Routers.route('/users/login/').post(usersCtrl.login);
    Routers.route('/users/login/').get(function(req, res){
        res.render('login.ejs');
    });
    Routers.route('/welcome').get(function(req,res){
        res.render('welcome.ejs');
    })
    Routers.route('/').get(usersCtrl.logout);



    return Routers;
})();