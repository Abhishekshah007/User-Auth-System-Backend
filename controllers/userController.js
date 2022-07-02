
const User = require("../model/userSchema");
const bigPromise = require("../middleware/handlePromise");
const cookieToken = require("../cookie-token");
const mailHelper = require("../emailHelper");
const crypto = require("crypto");

exports.signup = bigPromise( async (req,res,next)=>{

const { name, email, password} = req.body;    

if (!email || !name || !password) {
    //code
    return next(new Error("Name,Email and Password are required fields."));
    
}

const user = await User.create({
    name,
    password,
    email
});

cookieToken(user,res);


});


exports.login = bigPromise(async (req,res,next)=>{

    const {email,password} = req.body;

// check presence in db
if(!email || !password){
    return next(new Error("Email and Password is needed"));
}

    const user = await User.findOne({email}).select("+password");

if(!user){
    return next(new Error("Email or Password are not valid "));
}

// password validation

 const isPassValid = await user.isPassValidate(password);

 if(!isPassValid){
    return next(new Error("Email or Password are not valid "));
 }

 cookieToken(user,res);
});


exports.logout = bigPromise( async (req,res,next)=>{
    res.cookie("token", null ,{
        expires: new Date(Date.now()),
httpOnly: true
    })

    res.status(200).json({
        success:true,
        message:"Successfully logout"
    })
});

exports.forgotPassword = bigPromise( async (req,res,next)=>{
    const {email} = req.body;

    const user = await User.findOne({email});

    if(!user){
        return next(new Error("Email is not linked with this site "));
    }

    const forgotJWT = user.getForgotJWT();

    await user.save({ValidationBeforeSave:false});

    const urlPath = `${req.protocol}://${req.get("host")}/api/v1/forgotPassword/reset/${forgotJWT}`;
    const subject = "Reset Password Link";
    const msg = `Please click below link to change your password:/n /n /n ${urlPath} `;
console.log("worked")
    try{

        await mailHelper({
            email:user.email,
            subject:subject,
            msg
        })
        res.status(200).json({
            Success:true,
            message: "successfully"
        })
    }
    
    catch(error){
        user.forgotPassJWT=undefined;
        user.forgotPassExpiry=undefined;

        await user.save({ValidationBeforeSave:false});
        console.log(error)
        res.status(400).json({
            Success:false,
            error
        })
    }

});

exports.resetPassword = bigPromise( async (req,res,next)=>{

    token = req.params.token;

    const inTokenEncryption = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({inTokenEncryption, forgotPassExpiry: {$gt: Date.now()}});

    if(!user){
        return next(new Error("Token are not valid "));
    }

    if(req.body.password!==req.body.confirmPassword){
        return next(new Error("Password doesn't match wit confirm password"));
    }

    user.password = req.body.password;
    user.forgotPassJWT=undefined;
    user.forgotPassExpiry=undefined;
    await user.save();

    cookieToken(user,res);
});


exports.getAuthenticatedUser = bigPromise( async (req,res,next)=>{
    const user= await User.findById(req.user.id);

    res.status(200).json({
        success:true,
        user
    });
});