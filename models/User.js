const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({

    code: {
        type:String,
        unique: true,
        index:true
    },
    access_Token: String,
    createdAt: {
        type: Date,
        default:Date.now
    }
})

module.exports = mongoose.model('User', UserSchema)