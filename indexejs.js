const express = require("express");
const app = express();

const cors = require("cors");
const PORT = 8080;

const expressSesion = require("express-session");

const Ctn_producto = require("./apis/ctnbd_producto");
const ctn_producto = new Ctn_producto();

const Ctn_mensaje = require("./apis/ctnbd_mensaje");
const ctn_mensaje = new Ctn_mensaje();

const Ctn_usuario = require("./apis/ctnbd_usuario");
const ctn_usuario = new Ctn_usuario();

let passport = require("passport");
let passportStrategy = require("passport-local").Strategy;

const mongoStore = require("connect-mongo");
const advancedOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSesion({
    secret: "secreto",
    cookie: {
      httponly: false,
      secure: false,
      maxAge: 60000,
    },
    resave: false,
    saveUninitialized: false,
  })
);

let { Server: HttpServer } = require("http");
let soccket = require("./utils/sockets");

let path = require("path");
app.set("views", path.join(__dirname, "views", "ejs"));
app.set("view engine", "ejs");

let httpServer = new HttpServer(app);
let socket = new soccket(httpServer);
socket.init();

passport.use(
  "login",
  new passportStrategy((username, password, done) => {
    const main = async () => {
      let usuario = null;
      usuario = await ctn_usuario.login(username, password);

      if (usuario.status == "E") return done(null, false);
      if (usuario.status == "S") {
        let usuLogin = {
          username: usuario.user.username,
          password: usuario.user.password,
        };

        return done(null, usuLogin);
      }
    };
    main();
  })
);

passport.use(
  "register",
  new passportStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
      let newUser = {
        username: req.body.username,
        password: req.body.password,
      };

      const main = async () => {
        let usuario = null;
        usuario = await ctn_usuario.RegUsuario(newUser);

        req.session.mensaje = usuario.message;
        if (usuario.status == "E") {
          return done(null, false);
        } else {
          let user = usuario.user;
          return done(null, user);
        }
      };

      main();
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser((username, done) => {
  const main = async () => {
    let usuario = null;
    usuario = await ctn_usuario.findUser(username);

    done(null, usuario);
  };
  main();
});

app.use(passport.initialize());
app.use(passport.session());

let isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.render("login");
  }
};

app.get("/", isAuth, (req, res, next) => {
  const main = async () => {
    let productos = null;
    productos = await ctn_producto.listar_todo();
   // let user = req.session.user;
   let user = req.user.username;
    res.render("index", { productos, user });
  };
  main();
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

app.get("/registro", (req, res, next) => {
  res.render("registro");
});

app.get("/", (req, res, next) => {
  res.render("login");
});

app.get("/registro-error", (req, res, next) => {
  res.render("registro-error", { mensaje: req.session.mensaje });
});

app.get("/registro-exito", (req, res, next) => {
  res.render("registro-exito", { mensaje: req.session.mensaje });
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    if (err) res.send(JSON.stringify(err));
    res.redirect("login");
  });
});

app.post(
  "/registro",
  passport.authenticate("register", {
    failureRedirect: "registro-error",
    successRedirect: "registro-exito",
  })
);

app.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "registro-error",
    successRedirect: "/",
  })
);

httpServer.listen(PORT, () => {
  console.log(`Mi servidor está escuchando desde http://localhost:${PORT}`);
});
