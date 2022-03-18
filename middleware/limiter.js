//importation d'express-rate-limit
const rateLimit = require("express-rate-limit");


//importation nodemailer 
const nodemailer = require("nodemailer");

//paramétrage du transporter
const transporter = nodemailer.createTransport({
	host : process.env.SMTP_PATH,
	port : 465,
	secure : true,
	auth : {
		user : process.env.EMAIL_ENVOI,
		pass: process.env.EMAIL_PASSWORD,
	},
});

//paramétrage pour le dépassement de requête sur l'API globale
const emailsParamsGlobal = {
	from : process.env.EMAIL_ENVOI,
	to : process.env.EMAIL_DESTINATAIRE,
	subject : "Attention danger sur l'application",
	text : "Un utilisateur a effectué 50 requêtes en 15min sur l'application, il y a danger pour la sécurité de l'application"
};
//paramétrage pour le dépassement de requête sur le login
const emailsParamsLogin = {
	from : process.env.EMAIL_SENT,
	to : process.env.EMAIL_RECEIVED,
	subject : "Attention danger sur l'application",
	text : "Un utilisateur a fait plus de 5 tentatives de connexion sur l'application avec des identifiants invalides, il y a danger pour la sécurité de l'application"
};

//définition limiter si trop de tentatives de login avec identifiants erronés
exports.loginLimiter = rateLimit({
	windowMs : 15 * 60 * 1000, // 15min de blocage
	max : 5, // max 5 tentatives
	message : "Trop de tentative de connexion avec des identifiants invalides. Réessayez après 15min",

	//fonction appelée dès que limite atteinte
	onLimitReached: () => {
		transporter.sendMail(emailsParamsLogin);
	}
});

//définition limiter si trop de requêtes globales 
exports.globalLimiter = rateLimit({
	windowMs : 15 * 60 * 1000,
	max : 50, 
	message : "Vous avez effectué trop de requêtes",
    
	//fonction appelée dès que limite atteinte
	onLimitReached : () => {
		transporter.sendMail(emailsParamsGlobal);
	}
});