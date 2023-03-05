const jwt = require("jsonwebtoken");

exports.genToken = (id) =>{
    return jwt.sign({id}, process.env.Jwt_CODE,{expiresIn:"3d"});
};
