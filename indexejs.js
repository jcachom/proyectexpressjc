const express = require("express");
const app = express();

const cors = require("cors");
const PORT = 8080;

let expressSession = require("express-session");

const mongoStore = require("connect-mongo");
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    store: mongoStore.create({
      mongoUrl:
        "mongodb+srv://root:coderhouse@cluster0.lyn5t.mongodb.net/dbapiecommerce?retryWrites=true&w=majority",
      mongoOptions: advancedOptions,
    }),
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

const Ctn_producto = require("./apis/ctnbd_producto");
const ctn_producto = new Ctn_producto();

const Ctn_mensaje = require("./apis/ctnbd_mensaje");
const ctn_mensaje = new Ctn_mensaje();

let { Server: HttpServer } = require("http");
let soccket = require("./utils/sockets");

let path = require("path");
app.set("views", path.join(__dirname, "views", "ejs"));
app.set("view engine", "ejs");

let httpServer = new HttpServer(app);
let socket = new soccket(httpServer);
socket.init();

function acceso(req, res, next) {
  let { user } = req.query;

  //console.log("usuario:", user);
  //console.log("usuario sesion:", req.session.user);

  let valido=(req.session.user && user)
  try {
    if (req.session.user == user && valido) {
      next();
    } else {
      res.sendFile(path.join(process.cwd(), "/views/login.html"));
    }
  } catch (error) {
    console.log(error);
  }
}

app.get("/", acceso, (req, res, next) => {
  const main = async () => {
    let productos = null;
    productos = await ctn_producto.listar_todo();
    let user = req.session.user;
    res.render("index", { productos, user });
  };
  main();
});

app.get("/login", (req, res, next) => {
  let user = req.session.user

  console.log("usuario login:",user);
  res.sendFile(path.join(process.cwd(), "/views/login.html"));
  
});


app.post("/productos", (req, res, next) => {
  const main = async () => {
    let producto = req.body;
    let retorno = 0;
    retorno = await ctn_producto.guardar(producto);
    res.json({ mensaje: "registrado" });
  };
  main();
});

app.get("/productos", (req, res, next) => {
  const main = async () => {
    let productos = null;
    productos = await ctn_producto.listar_todo();
    res.json(productos);
  };
  main();
});

app.post("/api/productos-test", (req, res, next) => {
  const main = async () => {
    retorno = await ctn_producto.cargarProductosAleatorios();
    res.json(retorno);
  };
  main();
});

app.get("/mensaje", (req, res, next) => {
  const main = async () => {
    let mensajes = null;
    mensajes = await ctn_mensaje.listar_todo();
    res.json(mensajes);
  };
  main();
});

app.post("/mensaje", (req, res, next) => {
  const main = async () => {
    let mensaje = req.body;
    let retorno = 0;
    retorno = await ctn_mensaje.guardar(mensaje);
    res.json({ mensaje: "registrado" });
  };
  main();
});

app.post("/login", async (req, res) => {
  const { user } = req.body;
  try {
    req.session.user = user;

    const main = async () => {
      let productos = null;
      productos = await ctn_producto.listar_todo();
      res.render("index", { productos , user });
    };
    main();
  } catch (err) {
    console.log(err);
  }
});


 

app.get("/logout", (req, res) => {
  const user = req.session.user ;
  if (user){
    res.render(path.join(process.cwd(), "/views/ejs/logout.ejs"), { user }); 
  }else {
    res.sendFile(path.join(process.cwd(), "/views/login.html"));
  }

});

 

app.post("/logout", (req, res) => {
  const user = req.session.user;
  if (user) {
    req.session.destroy((err) => {
      if (!err) {
        res.render(path.join(process.cwd(), "/views/ejs/logout.ejs"), { user });
      }
    });
  }
});

httpServer.listen(PORT, () => {
  console.log(`Mi servidor está escuchando desde http://localhost:${PORT}`);
});
