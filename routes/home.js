const express = require("express");

const routes = express.Router();
const {home} = require("../controllers/home")

routes.route("/").get(home);

module.exports = routes;

