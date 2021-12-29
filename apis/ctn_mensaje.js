class ctn_mensaje {
    constructor() {
        this.listMensaje = []       
    }

    listar_todo() {
         
        if (this.listMensaje.length==0){
       
        return  [{ name : "",hora:"", mensaje:""}];
        }else {
       
         return   [...this.listMensaje] 
        } 

    }

    guardar(mensaje) {        
      
        this.listMensaje.push(mensaje)
        return mensaje
    }

    

  
}

module.exports = ctn_mensaje
