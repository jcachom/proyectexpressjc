let { mongoose } = require("../config/database");

let { Schema, model } = mongoose;

let { productoSchema } = require("./esquemas/producto");
let productoSchemaModel = new Schema(productoSchema);
let productoModel = new model("productos", productoSchemaModel);

const faker = require("faker");

class ctnbd_producto {
  constructor() {}

  async cargarProductosAleatorios() {
    let listprod = null;

    try {
      for (let i = 0; i < 1; i++) {
        let new_product_id = await this.getNewId();
        const obj = {
          id: new_product_id,
          title: faker.commerce.productName(),
          price: faker.commerce.price(1, 1000, 2),
          thumbnail: faker.image.imageUrl(128, 128, "sports"),
        };

        productoModel.create(obj);

        listprod = await this.listar_todo();
      }
    } catch (error) {
      console.log(error);
    }

    return listprod;
  }

  async getNewId() {
    let listProd = await productoModel
      .find({}, { id: 1, _id: 0 })
      .sort({ id: -1 })
      .limit(1);

    
    let max = 1;
    if (listProd.length > 0) {
      max = listProd[0].id + 1;
    }

    return max;
  }

  async listar_todo() {
    try {
      let productos = await productoModel.find({});

      if (productos.length == 0) {
        return { error: "producto no encontrado" };
      } else {
        return productos;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async guardar(prod) {
    try {
      let new_product_id = await this.getNewId();
      let obj = {
        id: new_product_id,
        title: prod.title,
        price: prod.price,
        thumbnail: prod.thumbnail,
      };

      productoModel.create(obj);

      return "1";
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = ctnbd_producto;
