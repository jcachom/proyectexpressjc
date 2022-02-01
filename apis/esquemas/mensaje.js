const joi = require("joi");
let id = joi.string();
 
let nombre = joi.string();
let apellido = joi.string();
let edad =  joi.number();
let alias= joi.string();
let avatar= joi.string();
let text =joi.string();
let fecha =joi.string();
 

const mensajeSchema = {
    author :{
        id : id.required() ,
        nombre:nombre.required(),
        apellido:apellido.required(),
        edad: edad.required(),
        alias:alias.required(),
        avatar:avatar.required()
    },
    fecha : fecha.required(),
    text : text.required()
};

module.exports = {
    mensajeSchema
};



