
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const path = require("path");

const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const app = express();

app.use(express.json());

// Middleware de paramétrage du CORS
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
	next();
});

//configuration helmet
app.use(helmet());

//configuration cors
app.use(cors());

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);
app.use("/api/post", commentRoutes);
app.use("/api", (req, res) => {
	res.status(200).send({ message: "ok" });
});

module.exports = app;