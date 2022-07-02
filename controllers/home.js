const bigPromise = require("../middleware/handlePromise");

exports.home= bigPromise((req,res)=>{
    res.status(200).json({
        success: true,
        greeting: "hello from API"
    });
})
