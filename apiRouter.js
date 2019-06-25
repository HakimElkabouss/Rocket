var express = require('express');
var usersCtrl = require('./routes/usersCtrl');
var messagesCtrl = require('./routes/messagesCtrl');
var likesCtrl = require('./routes/likesCtrl');

// Router
exports.router = (function(){
    var apiRouter = express.Router();

    // Users Routes
    apiRouter.route('/users/register/').post(usersCtrl.register);
    apiRouter.route('/users/register/').get(function(req,res){
        res.render('register.ejs');
    });
    apiRouter.route('/users/login/').post(usersCtrl.login);
    apiRouter.route('/users/login/').get(function(req, res){
        res.render('login.ejs');
    });
    apiRouter.route('/welcome').get(function(req,res){
        res.render('welcome.ejs');
    })
    apiRouter.route('/').get(usersCtrl.logout);










    // apiRouter.route('/users/me/').get(usersCtrl.getUserProfile);
    // apiRouter.route('/users/me/').put(usersCtrl.updateUserProfile);


    // Messages Routes
    apiRouter.route('/messages/new/').post(messagesCtrl.createMessage);
    apiRouter.route('/messages/').get(messagesCtrl.listMessages);

    // Likes Routes
    apiRouter.route('/message/:messageId/vote/like').post(likesCtrl.likePost);
    apiRouter.route('/message/:messageId/vote/dislike').post(likesCtrl.dislikePost);

    return apiRouter;
})();