const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator= require("validator");
const bcrypt = require("bcryptjs");
const jwt = require ("jsonwebtoken");
const crypto= require("crypto")
const userSchema =  new Schema({

    name:{
        type:String,
        required:[true, "Name is mandatory field"],
        maxlength:[40, "Value should be in a range of 40"]
    },

    email:{
        type:String,
        required:[true, "Email is mandatory field"],
        validate: [validator.isEmail, 'Please enter correct email'],
        unique: true
    },

    password:{
        type:String,
        required:[true, "Password is mandatory field"],
        minlength:[6, ' password should be length of 6'],
        select:false
    },



    forgotPassJWT:String,
    forgotPassExpiry:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
})

// encrypt pass [HOOKS]

userSchema.pre('save', async function(next){

    if(!this.isModified('password')){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);

})

// validate pass
userSchema.methods.isPassValidate = async function(inputPass){
    return await bcrypt.compare(inputPass, this.password);
}

// jwt genrating

userSchema.methods.getJWT =  function(){
    return    jwt.sign({id:this._id},
        process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRY
        });

}

// genrate forgot password token

userSchema.methods.getForgotJWT = function(){
const forgotToken= crypto.randomBytes(20).toString('hex');
  this.forgotPassJWT = crypto.createHash('sha256').update(forgotToken).digest('hex');

//   time
  this.forgotPassExpiry= Date.now()+20*60*1000;
  return forgotToken;
}

// export
module.exports = new mongoose.model('User',userSchema);
