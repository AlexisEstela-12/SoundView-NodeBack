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
    expiration_time:{
        type:Date,
        expires:'1h'
    },
    expires_at: {
        type: Date
    }
})


module.exports = mongoose.model('User', UserSchema)