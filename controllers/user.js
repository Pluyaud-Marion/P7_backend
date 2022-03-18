// importation bcrypt
const bcrypt = require("bcrypt");

//importation jwt
const jwt = require("jsonwebtoken");

//importation des modèles
const model = require("../models");

// regex validation pour champs firstname, lastname, job dans modèle user
exports.signUp = (req, res) => {
	const regexEmail = /^[^@\s]{2,30}@[^@\s]{2,30}\.[^@\s]{2,5}$/;
	
	const email = req.body.email;
	// si format email conforme à regex -> cryptage du mail, hashage password et enregistrement dans db
	if (regexEmail.test(email)) {
	
		bcrypt.hash(req.body.password, 10)
			.then(hash => {
				model.User.create({
					firstname: req.body.firstname,
					lastname : req.body.lastname,
					email: req.body.email,
					password : hash,
					job : req.body.job,
					isadmin : req.body.isadmin
				})
					.then(() => res.status(201).json({message : "Utilisateur créé et enregistré dans la base de données"}))
					.catch(error => {
						console.log(error);
						return res.status(400).json({ message : "Cette adresse email est déjà utilisée"});
					});
			})
			.catch(error => res.status(500).json({error}));
	} else {
		return res.status(404).json({message : "Le format de l'adresse mail n'est pas correct"});
	}
};

exports.login = (req, res) => {

	//cherche l'email dans la db
	model.User.findOne({ 
		where : {email : req.body.email}
	})
		.then(user => {
			//si l'user n'existe pas dans la db
			if(!user){
				return res.status(400).json({error : "Utilisateur inexistant et/ou Mot de passe incorrect"});
				//si user existe = on compare mot de passe enregistré dans db avec cet user, et celui de la requete 
			} else {
				bcrypt.compare(req.body.password, user.password)
					.then(verifyPassword => {
						//si verif KO
						if(!verifyPassword) { 
							return res.status(400).json({error : "Utilisateur inexistant et/ou Mot de passe incorrect"});
							//si vérif ok -> connecté -> on retourne l'userId + isadmin + le token (qui contient userId, la clé, l'expiration)
						} else {
							res.status(200).json({
								firstname: user.firstname,
								lastname: user.lastname,
								isadmin : user.isadmin,
								userId : user.id,
								token : jwt.sign(
									{userId : user.id},
									`${process.env.KEY_TOKEN}`,
									{expiresIn : "12h"}
								)
							});
						}
					})
					.catch(error => res.status(500).json({error}));
			}
		})
		.catch(error => res.status(500).json({error}));
};


// visualiser un profil en partie - retourne firstame, lastname et job
exports.getOneProfileSimplify = (req, res) => {
	//ciblage de l'user avec l'userId envoyé dans les paramètres de la requête
	model.User.findOne({
		where : {id : req.params.userId},
		attributes : ["firstname", "lastname", "job"] 
	})
	//user = contient l'utilisateur qu'on a demandé dans les paramètres des requete
		.then(user=> {
			if (!user) {
				return res.status(401).json({error : "Cet utilisateur n'existe pas"});
			} else {
				res.status(200).json(user);
			}
		})
		.catch(error => res.status(400).json({error}));
};

// visualiser un profil en totalité / admin ou utilisateur lui même 
exports.getOneProfileFull = (req, res) => {
	//on trouve l'user qui envoie la requête -> userRequest
	model.User.findOne({
		where : {id : res.locals.token.userId}
	})
		.then(userRequest => {
			//on trouve l'user concerné par la requête (celui envoyé dans les params de requete) -> user
			model.User.findOne({
				where : {id : req.params.userId},

			})
				.then(user=> {
					// si l'user qui veut faire la requête est admin ou si c'est le même que celui qui a fait l'user qu'on cible
					if (userRequest.isadmin === true || userRequest.id === user.id ) {
						if (!user) {
							return res.status(401).json({error : "Cet utilisateur n'existe pas"});
						} else {

							res.status(200).json(user);
						} 
					} else {
						return res.status(404).json({error : "Vous n'avez pas le droit de faire ça"});
					}
				})
				.catch(error => res.status(400).json({error}));
		})
		.catch(error => res.status(400).json({error}));
};


// L'admin peut visualiser tous les profils - 
exports.adminGetAllProfile = (req, res) => {
	//on cherche l'user qui envoie la requête -> userRequest
	model.User.findOne({
		attributes : ["isadmin", "firstname", "id"],
		where : { id : res.locals.token.userId}
	})
		.then((userRequest) =>{
			//s'il est admin = on visualise tous les users de la db
			if(userRequest.isadmin === true) {
				// ne renvoie que les utilisateurs qui sont pas admin
				model.User.findAll({
					where : { isadmin : false},
					attributes: {exclude: ["password"]},
					order : [["createdAt", "DESC"]] 
				})
					.then(allUsers => res.status(200).json(allUsers))
					.catch(error => res.status(400).json({error}));
			} else {
				return res.status(404).json({message : "Vous n'avez pas l'autorisation de faire ça"});
			}
		})
		.catch(error => res.status(400).json({error}));
};

//supprime de la db l'utilisateur
exports.deleteProfile = (req, res) => {
	//on cherche l'user qu'on envoie dans les paramètres de la requete -> user
	model.User.findOne({
		where : { id : req.params.userId }
	})
		.then(user => {
			//si celui qui a fait cet user est le même que celui qui veut faire la requête = on supprime l'user ciblé dans les paramètres
			if(user.id === res.locals.token.userId){
				model.User.destroy({
					where : { id : req.params.userId}
				})
					.then(()=> res.status(200).json({message : "Utilisateur supprimé"}))
					.catch(error => res.status(403).json({error}));
			} else {
				res.status(404).json({message: "Vous n'avez pas l'autorisation de supprimer un autre utilisateur"});
			}
		})
		.catch(error => {
			console.log(error);
			return res.status(400).json({message : "Cet utilisateur n'existe pas"});
		});
};

exports.updateProfileByAdmin = (req, res) => {
	const regexEmail = /^[^@\s]{2,30}@[^@\s]{2,30}\.[^@\s]{2,5}$/;
	const email = req.body.email;
	//on trouve l'user qui envoie la requête
	model.User.findOne({
		where : {id : res.locals.token.userId}
	})
		.then(userRequest => {
			//on trouve l'user qu'il veut modifier
			model.User.findOne({
				where : {id : req.params.userId},
			})
				.then(user=> {
					if (userRequest.isadmin === true) {
						if (!user) {
							return res.status(401).json({error : "Cet utilisateur n'existe pas"});
						} else {
							if (regexEmail.test(email)) {
								user.update({
									firstname: req.body.firstname,
									lastname: req.body.lastname,
									email: req.body.email,
									job: req.body.job,
									isadmin: req.body.isadmin,
								})
									.then(() => res.status(200).json({message: "Utilisateur modifié"}))
									.catch(error => res.status(400).json({error}));
							} else {
								return res.status(404).json({message : "Le format de la requête est invalide"});
							}
						} 
					} else {
						return res.status(404).json({error : "Vous n'avez pas le droit de faire ça"});
					}
				})
				.catch(error => res.status(400).json({error}));
		})
		.catch(error => res.status(400).json({error}));
};

exports.updateProfileByUser = (req, res) => {
	const regexEmail = /^[^@\s]{2,30}@[^@\s]{2,30}\.[^@\s]{2,5}$/;
	const email = req.body.email;
	//on trouve l'user qui envoie la requête
	model.User.findOne({
		where : {id : res.locals.token.userId}
	})
		.then(userRequest => {
			//on trouve l'user qu'il veut modifier
			model.User.findOne({
				where : {id : req.params.userId},
			})
				.then(user=> {
					if (userRequest.id === user.id ) {
						if (!user) {
							return res.status(401).json({error : "Cet utilisateur n'existe pas"});
						} else {
							if (regexEmail.test(email)) {
								bcrypt.hash(req.body.password, 10)
									.then(hash => {
										user.update({
											firstname: req.body.firstname,
											lastname : req.body.lastname,
											email: req.body.email,
											password : hash,
											job : req.body.job,
											isadmin : req.body.isadmin
										})
											.then((newUser) => res.status(200).json(newUser))
											.catch(error => res.status(400).json({error}));
									})
									.catch(error => res.status(500).json({error}));
							} else {
								return res.status(404).json({message : "Le format de l'adresse mail est invalide"});
							}
						} 
					} else {
						return res.status(404).json({error : "Vous n'avez pas le droit de faire ça"});
					}
				})
				.catch(error => res.status(400).json({error}));
		})
		.catch(error => res.status(400).json({error}));
};