//importation password-validator
const passwordValidator = require("password-validator");

//définition d'un schéma de password
const passwordSchema = new passwordValidator();

//schéma que password doit respecter
passwordSchema
	.is().min(6)                   // Doit contenir au moins 6 caractères 
	.is().max(100)                 // Doit contenir max 100 caractères 
	.has().uppercase(1)            // Doit avoir au moins 1 Majuscule
	.has().not().spaces()          // Pas d'espaces
	.has().digits(2)               // Doit avoir au moins 2 chiffres
	.has().symbols(1);             // impose symbole



//exportation
module.exports = (req, res, next) => {
	//si password trop faible
	if(!passwordSchema.validate(req.body.password)){
		return res.status(400).json({message : "Le mot de passe n'est pas conforme. Réessayez avec au moins 6 caractères, 1 majuscule, 2 chiffres et 1 caractère spécial"});
	} else {
		next();
	}
};