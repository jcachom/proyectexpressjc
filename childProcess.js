const argv = require("yargs").argv;

let cantEvaluacion = 0;
if (Number(argv.cant)) {
  cantEvaluacion = Number(argv.cant);
}

console.log("Entrando al hijo");
process.on("message", (data) => {
  console.log(`[CHILD]->${data}`);
  process.send({ res: lista() });
});

function lista() {
  let i = 0;
  let fin = 100000000;

  if (cantEvaluacion > 0) {
    fin = Number(cantEvaluacion);
  }

  let listado = [];

  let numRandom = 0;
  for (i = 0; i < fin; i++) {
    numRandom = Math.floor(Math.random() * (1000 - 1)) + 1;
    let findObject = listado.find(
      (e) => Number(e.numRandom) == Number(numRandom)
    );
    if (findObject) {
      findObject.cantveces = Number(findObject.cantveces) + 1;
    } else {
      findObject = {
        numRandom: numRandom,
        cantveces: 1,
      };
      listado.push(findObject);
    }
  }

  listado.sort(function (a, b) {
    return Number(a.numRandom) - Number(b.numRandom);
  });

  return listado;
}
