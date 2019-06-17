// Imports 
var models = require('../models');
var asyncLib = require('async');
var jwtUtils = require('../utils/jwt.utils');

// Constants
const TITLE_LIMIT = 2;
const CONTENT_LIMIT = 4;
const ITEMS_LIMIT = 50;

// Routes
module.exports = {
    createMessage : function(req, res){
        // récupérer en-tete de l'authorisation
        var headerAuth = req.headers['authorization'];
        var userId = jwtUtils.getUserId(headerAuth);

        // params
        var title = req.body.title;
        var content = req.body.content;

        if(title == null || content == null){
            res.status(400).json({'error':'missing parameters'});
        }

        if(title.length <= TITLE_LIMIT || content.length <= CONTENT_LIMIT){
            res.status(400).json({'error': 'invalid parameters'})
        }

        // Waterfall permet de simplifier les choses (optionnel)
        asyncLib.waterfall([
            function(done) {
                models.User.findOne({
                    // réupérer l'utilisateur qui le meme id
                  where: { id: userId }
                })
                .then(function(userFound) {
                  done(null, userFound);
                })
                .catch(function(err) {
                  return res.status(500).json({ 'error': 'unable to verify user' });
                });
            },
            function(userFound, done){
                if(userFound){
                    models.Message.create({
                        title : title,
                        content : content,
                        likes : 0,
                        UserId : userFound.id
                    })
                    .then(function(newMessage){
                        done(newMessage);
                    })
                }else {
                    res.status(404).json({'error': 'user not found'});
                }
            }

        ], function(newMessage){
            // Afficher le message si c'est bien posté
            if(newMessage){
                return res.status(201).json(newMessage);
            } else {
                return res.status(500).json({'error':'cannot post message'});
            }

        })
    },
        listMessages: function(req, res) {
        // pour selectionner les colonnes que l'on souhaite afficher
        var fields  = req.query.fields;
        // pour récuperer les messages par ségmentation
        var limit   = parseInt(req.query.limit);
        var offset  = parseInt(req.query.offset);
        // pour sortit la liste de messages via un ordre particulier
        var order   = req.query.order;
    
        if (limit > ITEMS_LIMIT) {
          limit = ITEMS_LIMIT;
        }
    
        models.Message.findAll({
          order: [(order != null) ? order.split(':') : ['title', 'ASC']],
          attributes: (fields !== '*' && fields != null) ? fields.split(',') : null,
          limit: (!isNaN(limit)) ? limit : null,
          offset: (!isNaN(offset)) ? offset : null,
          include: [{
            model: models.User,
            attributes: [ 'username' ]
          }]
        }).then(function(messages) {
          if (messages) {
            res.status(200).json(messages);
          } else {
            res.status(404).json({ "error": "no messages found" });
          }
        }).catch(function(err) {
          console.log(err);
          res.status(500).json({ "error": "invalid fields" });
        });
    }
}