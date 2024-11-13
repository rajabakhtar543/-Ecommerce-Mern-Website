const mongoose = require('mongoose');

const connectDB = async ()=>{
   try{ 
  const conn = await mongoose.connect(process.env.DB_CONN)
  console.log(`Data base is connected ${conn.connection.host}`)

   }
   catch(error){
    console.log(`Error in databse ${error}`) 
   }
}
module.exports = connectDB;