let {Server:SocketIO}=require("socket.io");

 

class Socket{
    //static instancia=null ;
  static instancia ;
  constructor(http){
   if(Socket.instancia){
        return  Socket.instancia;
    }
  
    Socket.instancia=this;
    this.IO=new SocketIO(http);
    
    this.usuarios=[];
     
  }

  init(){

    try {
               
        this.IO.on("connection",socket=>{
            console.log("Usuario conectado");          
           socket.emit("init",{});
    
            socket.on("mensaje",data=>{          
              this.IO.sockets.emit("listenserver",data);
            })
            
        socket.on("addProducto",data=>{         
          this.IO.sockets.emit("loadProducto",data);
        })

        socket.on("disconnect",data=>{

         console.log("Usuario desconectado")     ;                      
        })

              
       
        
    })


    } catch (error) {
       console.log(error) 
    }

  }
}

module.exports=Socket;