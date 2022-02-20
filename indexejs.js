const express = require("express");
let yargs=require("yargs");
const app = express();

const routerGlobalProcess =require("./router/globalprocess");
const routerMensaje =require("./router/mensaje");
const routerProducto =require("./router/producto");


const cors = require("cors");
let PORT = 8080;

let processArg=yargs(process.argv.slice(2)) 
delete processArg.argv.$0
let puertoParam = processArg.argv._;
puertoParam=puertoParam[0];

if (Number(puertoParam)){
  PORT=puertoParam ;
}


const expressSesion = require("express-session");
 
const Ctn_producto = require("./apis/ctnbd_producto");
const ctn_producto = new Ctn_producto();
 
const Ctn_usuario = require("./apis/ctnbd_usuario");
const ctn_usuario = new Ctn_usuario();

let passport = require("passport");
let passportStrategy = require("passport-local").Strategy;

  
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


app.use("/" ,routerGlobalProcess);
app.use("/" ,routerMensaje);
app.use("/" ,routerProducto);


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
   let user = req.user.username;
    res.render("index", { productos, user });
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
