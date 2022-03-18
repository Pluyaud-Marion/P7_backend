//importation fs
const fs = require("fs");

//importation des models
const model = require("../models");

exports.createComment = (req,res) => {
	//contient l'userId décodé du token
	const userIdToken = Number(res.locals.token.userId);
    
	//le commentaire contenu dans le corps de la requête
	const contentTextCom = req.body.comment;
    
	//si le commentaire contient un fichier + du texte
	if(req.file && contentTextCom) {
		const attachment = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
		const commentObject = JSON.parse(req.body.comment);
		const commentObjectUserId = Number(commentObject.UserId);
		// sécurité pour vérifier que le token contenu dans le corps de la requête est le même que celui décodé du token
		if(commentObjectUserId === userIdToken) {
	
			model.Comment.create({
				UserId : userIdToken,
				contentCom : commentObject.contentCom,
				attachmentCom : attachment,
				PostId : req.params.postId
			})
				.then(()=> {
					return res.status(201).json({ 
						message : "Commentaire enregisté sur le post avec un fichier et du texte",
					});
				})
				.catch(error => res.status(404).json({error}));

			//sinon -> pas d'autorisation
		} else {
			return res.status(404).json({message : "Vous n'êtes pas autorisé à faire ça"});
		}
		// si le commentaire contient qu'un fichier
	} else if (req.file) {
		const attachment = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
		
		model.Comment.create({
			UserId : userIdToken,
			attachmentCom : attachment,
			PostId : req.params.postId
		})
			.then(()=> {
				return res.status(201).json({ 
						
					message : "Commentaire enregisté sur le post avec seulement un fichier",
				});
			})
			.catch(error => res.status(404).json({error}));
		
		//si le commentaire ne contient que du texte
	} else {
		const commentObject = JSON.parse(req.body.comment);
		const commentObjectUserId = Number(commentObject.UserId);
		console.log("je n'ai pas de fichier");
		//sécurité
		if(commentObjectUserId === userIdToken) {
		
			model.Comment.create({
				UserId : userIdToken,
				contentCom : commentObject.contentCom,
				PostId : req.params.postId
			})
				.then(()=> {
					return res.status(201).json({ 
						
						message : "Commentaire enregisté sur le post avec seulement du texte",
					});
				})
				.catch(error => res.status(404).json({error}));
			
		} else {
			return res.status(404).json({message : "Vous n'êtes pas autorisé à faire ça"});
		}
	}
};

// affiche tous les commentaires d'un post par son id
exports.getAllCommentForPost = (req,res) => {
	model.Comment.findAll({
		where : { PostId : req.params.postId },
		//rattache au commentaire le post et l'utilisateur (ne retourne que son nom et prénom)
		include : [model.Post, {
			model : model.User, 
			attributes : ["lastname", "firstname"]
		}],
	
		order : [["createdAt", "DESC"]]
	})
		.then(allCommentPost => {
			if(allCommentPost.length){ //si le tableau des comments de ce post est vide
				return res.status(200).json(allCommentPost);

			} else {
				return res.status(400).json({message : "Ce post n'a pas de commentaire"});
			}
		})
		.catch(error => res.status(400).json({error}));
};


exports.deleteComment = (req, res) => {
	const idUserToken = res.locals.token.userId;
	const selectComment = { where : { id: req.params.commentId} };
 
	//cherche l'utilisateur qui veut faire la requête et renvoie si admin ou non
	model.User.findOne({
		attributes : ["isadmin", "firstname", "lastname"],
		where : {id : idUserToken}
	})
		.then(userRequest => {
			//cherche le commentaire
			model.Comment.findOne(selectComment)
      
				.then(comment => {
					//si utilisateur qui veut supprimer est celui qui a publié le com, OU s'il est admin
					if(comment.UserId === idUserToken || userRequest.isadmin === true ){
						//si y a un fichier
						if (req.file) {
							const filename = comment.attachmentCom.split("/images/")[1];
            
							fs.unlink(`images/${filename}`, () => {
								model.Comment.destroy(selectComment)
									.then(() => {
										return res.status(200).json({message : "Le commentaire a été supprimé"});
									})
									.catch(error => res.status(400).json({error}));
							});
							// si y a pas de  fichier
						} else {
							model.Comment.destroy(selectComment)
								.then(() => {
									return res.status(200).json({message : "Le commentaire a été supprimé"});
								})
								.catch(error => res.status(400).json({error}));
						}
						// si celui qui veut supprimer n'est ni l'auteur du com, ni un admin
					} else {
						return res.status(404).json({ error : "Vous n'avez pas l'autorisation de supprimer un commentaire qui ne vous appartient pas"});

					} 
				})
				.catch(error => {
					console.log(error);
					return res.status(404).json({error : "Ce commentaire n'existe plus"});
				});
		
		})
		.catch(error => res.status(400).json({error}));

    
};
