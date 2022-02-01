require("dotenv").config();
const mongoose = require("mongoose");
//const MONGO_URI =`${process.env.MONGO_DB_URI}${process.env.DB_NAME}`;
const MONGO_ATLAS_URI = `${process.env.MONGO_ATLAS}`;

let connection;
(async () => {
  try {
    connection = mongoose.connect(MONGO_ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("conexion establecida");
    console.log("------------------------------------");
  } catch (error) {
    console.log(error);
  }
})();

module.exports = { connection, mongoose };
