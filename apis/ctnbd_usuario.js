let { mongoose } = require("../config/database");

let { Schema, model } = mongoose;

let { usuarioSchema } = require("./esquemas/usuario");
let usuarioSchemaModel = new Schema(usuarioSchema);
let usuarioModel = new model("usuarios", usuarioSchemaModel);

 

class ctnbd_usuario {
  constructor() {}

  async usuario(username, pass) {
   
    let response ={
        autorizado:"S"
    }

    try {
        
        let usuario = await usuarioModel.find( {email: username , password : pass });
    
        if ( usuario.length == 0 ){
            response.autorizado = "N"
        }

    } catch (error) {
        console.log(error)
    }
  
    return response
    };

 
}

module.exports = ctnbd_usuario;
