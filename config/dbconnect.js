const mongoose = require("mongoose");


const connectDB = ()=>{
    mongoose.connect(process.env.DB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    }).then(
            console.log("Successfully connected wit DB")
            ).catch(error=>{
        console.log(`connection error`);
        console.log(error);
        process.exit(1);
})
    
}

module.exports= connectDB