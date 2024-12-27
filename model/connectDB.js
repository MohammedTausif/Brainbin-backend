const mongoose = require ('mongoose')
require('dotenv').config();



const URL = process.env.DB_URL

const connectDB=async ()=>{
    if(!URL){
        console.log("Database URL is not defined , please check env file")
    }
    try{
        await mongoose.connect(URL)
        .then(()=> console.log("Database connected"))
    }catch(e){
     console.log("error connecting DB", e)
    }
}
module.exports = {connectDB}