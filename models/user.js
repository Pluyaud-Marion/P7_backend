"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		static associate(models) {
			/*
      Relation 0 à plusieurs entre User et Post
      Un User peut faire plusieurs Post ou 0
      */
			models.User.hasMany(models.Post, {
				foreignKey : {
					allowNull : false
				},
				onDelete : "CASCADE"
			});
      
			/*
      Relation 0 à plusieurs entre User et Comment
      Un User peut faire plusieurs Comment ou 0
      */
			models.User.hasMany(models.Comment, {
				foreignKey : {
					allowNull : false
				}, 
				onDelete : "CASCADE"
			});

		}
	}
	User.init({
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		firstname: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				is:/^[a-zA-ZÀ-ÿ\s_-]{2,60}$/
			}
		},
		lastname: {
			allowNull: false,
			type: DataTypes.STRING,
			validate: {
				is:/^[a-zA-ZÀ-ÿ\s_-]{2,60}$/
			}
		},
		email: {
			allowNull: false,
			unique : true,
			type: DataTypes.STRING
		},
		password: {
			allowNull: false,
			type: DataTypes.STRING,
		},
		job: {
			allowNull: true,
			type: DataTypes.STRING,
			validate: {
				is:/^[a-zA-ZÀ-ÿ\s_-]{2,60}$/
			}
		},
		isadmin: {
			allowNull: false,
			type: DataTypes.BOOLEAN,
			defaultValue : false
		},
		createdAt: {
			allowNull: false,
			type: DataTypes.DATE
		},
		updatedAt: {
			allowNull: false,
			type: DataTypes.DATE
		}
	}, 
	{
		sequelize,
		modelName: "User",
	});
	return User;
};