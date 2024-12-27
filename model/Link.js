const mongoose = require('mongoose')


const LinkSchema = new mongoose.Schema({
    hash: String,
    userId: {type:mongoose.Types.ObjectId, ref: 'User', required: true}
})

const LinkModel = mongoose.model('Link', LinkSchema);
module.exports = LinkModel