const joi = require("joi");
 
 
let email = joi.string();
let password = joi.string();
 
 

const usuarioSchema = {
 
    email : email.required(),
    password : password.required()
};

module.exports = {
    usuarioSchema
};

