const mongoose = require('mongoose')

const ContentSchemna = new mongoose.Schema({
    title: String,
    link: String,
    desc: String,
    type: String,
    userId : {type:mongoose.Types.ObjectId, ref:'User', required: true}
})

const ContentModel = mongoose.model('Content', ContentSchemna);
module.exports= ContentModel