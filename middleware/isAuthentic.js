const User = require("../model/userSchema");
const bigPromise = require("../middleware/handlePromise");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = bigPromise(async (req,res,next)=>{
    console.log("req.cookies.token")
    let token = req.body.token || req.cookies.token;
    console.log("req.cookies.token")
    if (!token && req.header("Authorization")) {
        token = req.header("Authorization").replace("Bearer ", "");
      }
    
      if (!token) {
        return next(new Error("Login first to access this page"));
      }
    

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id);
    
      next();
})