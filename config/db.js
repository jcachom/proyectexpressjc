
let {db}=require("./index");
let knex =require("knex");

let mysql = knex({
    client: 'mysql',
    connection: {
      host: db.dbHost,
      user: db.dbUser,
      password: db.dbPassword,
      database: db.dbName
    },
    pool: { min: 0, max: 7 }
  })


  let sqlite = knex({
    client: 'sqlite3',
    connection: { filename: './config/ecommerce.sqlite' }
  })


  class DataBase {
    
   static client_mysql;
   static client_sqlite;
   constructor(cliente){
     
       if (cliente=="mysql"){

        if(DataBase.client_mysql){
          return DataBase.client_mysql;
      }    
      DataBase.client_mysql=mysql;
      this.client_mysql=DataBase.client_mysql;

       }


       if (cliente=="sqlite"){


        if(DataBase.client_sqlite){
          return DataBase.client_sqlite;
      }
      DataBase.client_sqlite=sqlite;
      this.client_sqlite=DataBase.client_sqlite;


       }


     
   }

  }

  module.exports=DataBase;
  //module.exports=new DataBase();