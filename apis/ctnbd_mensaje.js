const { config} =require("../config"); 
const classDB =require("../config/db");
const db_obj =new classDB("sqlite");
const db=db_obj.client_sqlite ;


class ctnbd_mensaje {
    constructor() {
       
       const main = async () => {
        let response_tbl = await this.crearTablaMensaje();                   
        }
        main();

    }

    async crearTablaMensaje() {
         
        try {
            if (! (await db.schema.hasTable('chat_mensaje')) ) {
                await db.schema.createTable('chat_mensaje', table=>{
                    table.increments("id").primary(),
                    table.string("name"),    
                    table.string("hora"),    
                    table.string("mensaje")          
                });
              }                    
        } catch (error) {
            console.log(error);           
        }

      }


      async listar_todo() {
                   
        let response=await db.from("chat_mensaje") ;
        let listMensaje=[] ;
        for(let i=0; i < response.length; i++){
            let  chatmensaje={
                name:  response[i].name,
                hora:   response[i].hora ,
                mensaje: response[i].mensaje
            }
            listMensaje.push(chatmensaje)
        }
   
        if (listMensaje.length==0){
            return   [{ name : "",hora:"", mensaje:""}];
           }else {
             return  [...listMensaje] 
           }  


    }

    async guardar(objmensaje) {        
      
     

        try {
         
            let data =[
                {
                    name:objmensaje.name,
                    hora :objmensaje.hora,
                    mensaje : objmensaje.mensaje
                }          
            ]           
            let response=await db.from("chat_mensaje").insert(data);
            return "1" ;
        } catch (error) {
            console.log(error);    
        }


    }

    

  
}

module.exports = ctnbd_mensaje
