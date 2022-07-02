const express = require("express");
const routes = express.Router();
const {isAuthenticated} = require("../middleware/isAuthentic");

const {signup,login,logout,forgotPassword,resetPassword,getAuthenticatedUser} = require("../controllers/userController")

routes.route("/signup").post(signup);
routes.route("/login").post(login);
routes.route("/logout").get(logout);
routes.route("/forgotPassword").post(forgotPassword);
routes.route("/forgotPassword/reset/:token").post(resetPassword);
routes.route("/dashBoard").get(isAuthenticated,getAuthenticatedUser);
module.exports = routes;
