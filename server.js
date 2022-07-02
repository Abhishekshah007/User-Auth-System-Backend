require("dotenv").config();
const connectDB = require("./config/dbconnect");
connectDB();
const express= require("express");
const app = express()
const port = process.env.PORT || 5000;




app.use(express.json());
app.use(express.urlencoded({ extended: true} ));
const home = require("./routes/home");
const user = require("./routes/user");
app.use('/api/v1',user);
app.use('/api/v1',home);
app.listen(process.env.PORT,()=>{
console.log("server running on "+ process.env.PORT)
})
