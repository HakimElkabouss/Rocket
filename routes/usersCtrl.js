var bcrypt = require('bcrypt');
// var jwtUtils = require('../utils/jwt.utils');
var models = require('../models');
var asyncLib = require('async');

// Constants
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX = /^(?=.*\d).{4,8}$/;

module.exports = {
    register : function(req, res){

        var email = req.body.email;
        var username = req.body.username;
        var password = req.body.password;
        var ConfirmPassword = req.body.ConfirmPassword;

        if(email == null || username == null || password == null || ConfirmPassword == null){
            return res.render('register.ejs',{error: 'missing parameters'});
        }
        if(password != ConfirmPassword){
          return res.render('register.ejs',{error: 'you have cheated on the password confirmation'});
        }
        if(username.length >= 13 || username.length <= 4){
            return res.render('register.ejs',{error: 'wrong username ( must be length (5 - 12) )'});
        }
        if(!EMAIL_REGEX.test(email)){
            return res.render('register.ejs',{error: 'email is not valid'});
        }
        if(!PASSWORD_REGEX.test(password)){
            return res.render('register.ejs',{error: 'Password must be between 4 and 8 digits long and include at least one numeric digit'});
        }
        
        // Async est un module utilitaire qui fournit des fonctions simples et puissantes pour travailler avec du JavaScript asynchrone.
        // Waterfall permet de simplifier les choses (optionnel)
        asyncLib.waterfall([
          function(done) {
            // Vérifier si l'utilisateur est présent dans la base de données
            models.User.findOne({
              attributes: ['email'],
              where: { email: email }
            })
            .then(function(userFound) {
              done(null, userFound);
            })
            .catch(function(err) {
              return res.render('register.ejs',{ error: 'unable to verify user' });
            });
          },
          function(userFound, done) {
            // hasher le mot de passe
            if (!userFound) {
              bcrypt.hash(password, 5, function( err, bcryptedPassword ) {
                done(null, userFound, bcryptedPassword);
              });
              // si l'utilisateur est déjà saisie dans la base de données
            } else {
              return res.render('register.ejs',{ error: 'user already exist' });
            }
          },
          // sinon faut le créer a nouveau
          function(userFound, bcryptedPassword, done) {
            // saisir un nouveau utilisateur
            var newUser = models.User.create({
              email: email,
              username: username,
              password: bcryptedPassword,
              isAdmin: 0
            })
            .then(function(newUser) {
              done(newUser);
            })
            .catch(function(err) {
              return res.render('register.ejs',{ error: 'cannot add user' });
            });
          }
        ], function(newUser) {
          if (newUser) {
            return res.render('login.ejs');
          } else {
            return res.render('register.ejs',{ error: 'cannot add user' });
          }
        });
      },
    login : function(req, res){
        var email = req.body.email;
        var password = req.body.password;

        if(email == null || password == null){
            return res.render('login.ejs',{error: 'missing parameters'});
        }

        // Waterfall permet de simplifier les choses (optionnel)
        asyncLib.waterfall([
            function(done) {
              models.User.findOne({
                where: { email: email }
              })
              .then(function(userFound) {
                done(null, userFound);
              })
              .catch(function(err) {
                return res.render('login.ejs',{ error: 'unable to verify user' });
              });
            },
            function(userFound, done) {
              if (userFound) {
                bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt) {
                  done(null, userFound, resBycrypt);
                });
              } else {
                return res.render('login.ejs',{ error: 'user not exist' });
              }
            },
            function(userFound, resBycrypt, done) {
              if(resBycrypt) {
                done(userFound);
              } else {
                return res.render('login.ejs',{ error: 'invalid password' });
              }
            }
          ], function(userFound) {
            if (userFound) {
              return res.redirect('/welcome');
            } else {
              return res.render('login.ejs',{ error: 'cannot log on user' });
            }
      });
    },
      logout : function(req, res){
          res.render('index.ejs')
      },
      
    }
