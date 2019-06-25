var express = require('express');
var usersCtrl = require('./routes/usersCtrl');
var messagesCtrl = require('./routes/messagesCtrl');
var likesCtrl = require('./routes/likesCtrl');

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










    // apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    // apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);


    // Messages Routes
    Routers.route('/messages/new/').post(messagesCtrl.createMessage);
    Routers.route('/messages/').get(messagesCtrl.listMessages);

    // Likes Routes
    Routers.route('/message/:messageId/vote/like').post(likesCtrl.likePost);
    Routers.route('/message/:messageId/vote/dislike').post(likesCtrl.dislikePost);

    return Routers;
})();