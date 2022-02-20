const express = require("express");
const router = express.Router();

const Ctn_producto = require("../apis/ctnbd_producto");
const ctn_producto = new Ctn_producto();

router.post("/productos", (req, res, next) => {
  const main = async () => {
    let producto = req.body;
    let retorno = 0;
    retorno = await ctn_producto.guardar(producto);
    res.json({ mensaje: "registrado" });
  };
  main();
});

router.get("/productos", (req, res, next) => {
  const main = async () => {
    let productos = null;
    productos = await ctn_producto.listar_todo();
    res.json(productos);
  };
  main();
});

router.post("/api/productos-test", (req, res, next) => {
  const main = async () => {
    retorno = await ctn_producto.cargarProductosAleatorios();
    res.json(retorno);
  };
  main();
});

module.exports = router;
