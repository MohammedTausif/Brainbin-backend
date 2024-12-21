import mongoose ,{ Schema, model } from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

try{
     mongoose.connect(process.env.DATABASE_URL)
    console.log("Database connected successfully")
}catch(error){
     console.log("Error Connecting to DB :", error)
}

const UserSchema = new Schema({
    username: { type: String, unique: true },
    password: String 
})

const ContentSchema = new Schema({
    title: String,
    link: String,
    desc: String,
    type: String , 
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
})

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
})


export const LinkModel = model("Link", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
export const UserModel = model("User", UserSchema);