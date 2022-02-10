let { mongoose } = require("../config/database");
const bcrypt = require("bcryptjs");

let { Schema, model } = mongoose;

let { usuarioSchema } = require("./esquemas/usuario");
let usuarioSchemaModel = new Schema(usuarioSchema);
let usuarioModel = new model("usuarios", usuarioSchemaModel);

 

class ctnbd_usuario {
  constructor() {}

    async login(username, password) {
  
       
        let usuario = await usuarioModel.findOne( {username: username});
        let response ={
            status:"",
            message : ""
        }
        if (!usuario ){
            response.status = "E"
            response.message ="Usuario no encontrado"
           
        }
        if (usuario &&   bcrypt.compareSync(password, usuario.password)  ){
            response.status = "S"
            response.message =""
            response.user =usuario
        } else {
            response.status = "E"
            response.message ="Usuario/contraseña incorrecta."
        }
    
        return response
        
    }

    async RegUsuario(usuario) {

        let usuarioFind = await usuarioModel.findOne( {username: usuario.username});
        let response ={
            status:"",
            message : ""            
        }

        if (usuarioFind ){
            response.status = "E"
            response.message ="Usuario ya registrado."           
        } else
        {
            const user = {         
                username: usuario.username,
                password:  bcrypt.hashSync(usuario.password ,10)         
            };        
          usuarioModel.create(user)
          response.status = "S"
          response.message ="Usuario creado."  
          response.user = user ;
        
          
        }
        return response

    }


    async findUser(username) {       
        let usuario = await usuarioModel.findOne( {username: username});      
        return usuario
        
    }


 
}

module.exports = ctnbd_usuario;
