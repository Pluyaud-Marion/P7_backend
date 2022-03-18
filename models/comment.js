"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
	
		static associate(models) {
			/*
      Relation 0 à plusieurs entre Comment et Post
      Comment appartient à Post
      */
			models.Comment.belongsTo(models.Post, {
				onDelete : "CASCADE"
			});
			/*
      Relation 0 à plusieurs entre Comment et User
      Comment appartient à User
      */
			models.Comment.belongsTo(models.User, {
				onDelete : "CASCADE"
			});
		}
	}
	Comment.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		contentCom : {
			allowNull: true,
			type : DataTypes.TEXT
		},
		attachmentCom : {
			allowNull: true,
			type : DataTypes.STRING
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
	}, {
		sequelize,
		modelName: "Comment",
	});
	return Comment;
};