const express = require('express')
const app = express()


const cors=require("cors");
const PORT=8080 ;
 


app.use(cors("*"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 

const Ctn_producto =require("./apis/ctnbd_producto");
const ctn_producto = new Ctn_producto()

const Ctn_mensaje =require("./apis/ctnbd_mensaje")
const ctn_mensaje = new Ctn_mensaje();

 

let  {Server:HttpServer}=require("http");
let soccket=require("./utils/sockets");

let path=require("path");
app.set("views",path.join(__dirname,"views","ejs"))
app.set("view engine","ejs");

let httpServer=new HttpServer(app);
let socket=new soccket(httpServer);
socket.init();

app.get("/",(req,res,next)=>{  
 
  const main = async () => {
    let productos = null;
    productos=await ctn_producto.listar_todo();
    res.render("index",{productos});
  };
  main();

})

 
  app.post("/productos",(req,res,next)=>{  
  
    const main = async () => {
      let producto = req.body ;
      let retorno=0;
      retorno=await ctn_producto.guardar(producto); 
      res.json({mensaje:"registrado"} );
    };
    main();

})

app.get("/productos",(req,res,next)=>{

   const main = async () => {
    let productos = null;
    productos=await ctn_producto.listar_todo();
    res.json(productos);
  };
  main();
   
})

 
app.post("/api/productos-test",(req,res,next)=>{  
  
  const main = async () => {
  
    retorno=await ctn_producto.cargarProductosAleatorios(); 
    res.json(retorno);
  };
  main();

})

 


app.get("/mensaje",(req,res,next)=>{
 
 const main = async () => {
  let mensajes = null;
  mensajes=await ctn_mensaje.listar_todo();
  res.json(mensajes);
};
main();


})

app.post("/mensaje",(req,res,next)=>{
 
   const main = async () => {
    let mensaje = req.body ;
    let retorno =0;
    retorno=await ctn_mensaje.guardar(mensaje); 
    res.json({mensaje:"registrado"} );
  };
  main();


})

 

httpServer.listen(PORT,()=>{
  console.log(`Mi servidor está escuchando desde http://localhost:${PORT}`)
  })


 