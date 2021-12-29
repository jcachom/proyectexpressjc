
const { config} =require("../config"); 
const classDB =require("../config/db");
const db_obj =new classDB("mysql");
const db=db_obj.client_mysql ;
 
 
class ctnbd_producto {
    constructor() {
      
       const main = async () => {
        let response_tbl = await this.crearTablaProducto();  
        let response_carga = await this.cargaMaestroProducto();               
        }
        main();



    }

   
    async crearTablaProducto() {
         
        try {
            if (! (await db.schema.hasTable('productos')) ) {
                await db.schema.createTable('productos', table=>{
                    table.increments("id").primary(),
                    table.string("title"),    
                    table.decimal('price', 8, 2),
                    table.string("thumbnail")          
                });
              }                    
        } catch (error) {
            console.log(error);           
        }

      }


      async cargaMaestroProducto() {
         
       
        try {
            let data =[
                {
                    title: "casaca",
                    price :"12.30",
                    thumbnail :"https://cdn3.iconfinder.com/data/icons/fashion-beauty-vol-1/512/jacket_bomber_leather_clothes-128.png"                      
                },
                {
                    title: "abrigo",
                    price :"25.36",
                    thumbnail :"https://cdn3.iconfinder.com/data/icons/fashion-beauty-vol-1/512/shorts_sports_clothes_pants-128.png"                      
                }
            ]
           
            let response=await db.from("productos").insert(data);
              
        } catch (error) {
            console.log(error);    
        }


      }


      

     

    async listar_todo() {

        let response=await db.from("productos") ;
        let listProductos=[] ;
        for(let i=0; i < response.length; i++){
            let  producto={
                title:  response[i].title,
                price:   response[i].price ,
                thumbnail: response[i].thumbnail
            }
            listProductos.push(producto)
        }
   
        if (listProductos.length==0){
            return  { error : 'producto no encontrado' };
           }else {
             return  [...listProductos]        
           }  

    }

    async  guardar(prod) {
     
        try {
         
            let data =[
                {
                    title:prod.title,
                    price :prod.price,
                    thumbnail : prod.thumbnail
                }          
            ]           
            let response=await db.from("productos").insert(data);
            return "1" ;
        } catch (error) {
            console.log(error);    
        }
    }
    
}

module.exports = ctnbd_producto
