const mongoose = require('mongoose')
const Schema = mongoose.Schema
const UserSchema = new Schema({

    user_id: {
        type:String,
        unique: true,
        index:true
    },
    access_Token: String,
    refresh_Token: String,
    expireAt: {
        type: Date,
        default: Date.now,
        expires: 2*60
    }
})


module.exports = mongoose.model('User', UserSchema)