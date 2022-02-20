const express = require("express");
const router = express.Router();

const yargs = require("yargs");
const { fork } = require("child_process");

let processArg = yargs(process.argv.slice(2));
delete processArg.argv.$0;

router.get("/info", (req, res, next) => {
  let datos = {
    argumentos: processArg.argv,
    Plataforma: process.platform,
    VersionNode: process.version,
    memoria: process.memoryUsage(),
    rutaEjecucion: process.execPath,
    processId: process.pid,
    carpetaProyecto: process.cwd(),
  };

  res.json(datos);
});

router.get("/api/randoms", (req, res, next) => {
  let { cant } = req.query;
  console.log(cant);
  let paramFork = "--cant=" + cant;
  let child_process = fork("./childProcess.js", [paramFork]);
  child_process.send("solicitud padre");
  child_process.on("message", (data) => {
    res.json(data);
  });
});

module.exports = router;
