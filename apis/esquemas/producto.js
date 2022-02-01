const joi = require("joi");
let id = joi.number();
 
let title = joi.string();
let price = joi.number();
let thumbnail = joi.string();
 

const productoSchema = {
  id: id.required(),
  title: title.required(),
  price: price.required(),
  thumbnail: thumbnail.required()
};

module.exports = {
  productoSchema,
};
