let { mongoose } = require("../config/database");

let { Schema, model } = mongoose;

let { mensajeSchema } = require("./esquemas/mensaje");
let mensajeSchemaModel = new Schema(mensajeSchema);
let mensajeModel = new model("mensajes", mensajeSchemaModel);

let { schema, normalize, denormalize } = require("normalizr");
let inspect = require("../utils/objectPrinter");

class ctnbd_mensaje {
  constructor() {}

  async listar_todo() {
    let listMensaje = await mensajeModel.find({});

    let listComentario = {
      id: "1000",
      chat: [],
    };

    let index = 0;

    listMensaje.forEach(function (item) {
      index = index + 1;
      let obj = {
        id: index,
        author: { ...item.author },
        text: item.text,
        fecha: item.fecha,
      };

      listComentario.chat.push(obj);
    });

    const usuario = new schema.Entity("usuario");
    const comentario = new schema.Entity("comentario", {
      author: usuario,
    });

    const lcomentario = new schema.Entity("lcomentario", {
      chat: [comentario],
    });

    let listComentNormalizado = normalize(listComentario, lcomentario);

    inspect(listComentNormalizado);
    console.log(
      "longitud sin normalizar:",
      JSON.stringify(listComentario).length
    );
    console.log(
      "longitud normalizado:",
      JSON.stringify(listComentNormalizado).length
    );

    let listComentDesNormalizado = denormalize(
      listComentNormalizado.result,
      lcomentario,
      listComentNormalizado.entities
    );
    console.log(
      "longitud desnormalizado:",
      JSON.stringify(listComentDesNormalizado).length
    );
    inspect(listComentDesNormalizado);

    return listComentNormalizado;
  }

  async guardar(objmensaje) {
    try {
      let hoy = new Date();
      let fecha =
        hoy.getDate() + "/" + (hoy.getMonth() + 1) + "/" + hoy.getFullYear();
      let hora =
        hoy.getHours() + ":" + hoy.getMinutes() + ":" + hoy.getSeconds();
      let fecha_f = fecha + " " + hora;

      let obj = {
        author: {
          id: objmensaje.author.id,
          nombre: objmensaje.author.nombre,
          apellido: objmensaje.author.apellido,
          edad: objmensaje.author.edad,
          alias: objmensaje.author.alias,
          avatar: objmensaje.author.avatar,
        },
        fecha: fecha_f,
        text: objmensaje.text,
      };

      mensajeModel.create(obj);

      return "1";
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ctnbd_mensaje;
