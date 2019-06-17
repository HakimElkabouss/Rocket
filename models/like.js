'use strict';
module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define('Like', {
    messageId: {
       type : DataTypes.INTEGER,
       references: {
         model: 'Message',
         key: 'id'
       }
    },
    userId: {
       type : DataTypes.INTEGER,
       references : {
         model: 'User',
         key: 'id'
       }
    },
    // pour éviter d'avoir les nombre négatifs 
    isLike : DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    // associations can be defined here

    // mettre les relations One-to-many & many-to-many
    models.User.belongsToMany(models.Message, {
      through: models.Like,
      foreignKey: 'userId',
      otherKey: 'messageId',
    });

    models.Message.belongsToMany(models.User, {
      through: models.Like,
      foreignKey: 'messageId',
      otherKey: 'userId',
    });

    // mettre une relation entre les clés étrangères et la table de référence
    models.Like.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    models.Like.belongsTo(models.Message, {
      foreignKey: 'messageId',
      as: 'message',
    });

  };
  return Like;
};