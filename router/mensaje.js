const express = require("express");
const router = express.Router();
const Ctn_mensaje = require("../apis/ctnbd_mensaje");
const ctn_mensaje = new Ctn_mensaje();

router.get("/mensaje", (req, res, next) => {
  const main = async () => {
    let mensajes = null;
    mensajes = await ctn_mensaje.listar_todo();
    res.json(mensajes);
  };
  main();
});

router.post("/mensaje", (req, res, next) => {
  const main = async () => {
    let mensaje = req.body;
    let retorno = 0;
    retorno = await ctn_mensaje.guardar(mensaje);
    res.json({ mensaje: "registrado" });
  };
  main();
});

module.exports = router;
