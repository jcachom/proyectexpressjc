const joi = require("joi");
 
 
let username = joi.string();
let password = joi.string();
 
 

const usuarioSchema = {
 
    username : username.required(),
    password : password.required()
};

module.exports = {
    usuarioSchema
};

