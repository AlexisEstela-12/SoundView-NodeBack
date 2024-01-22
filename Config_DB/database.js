const mongoose = require('mongoose')
const User = require('../models/User')
// mongoose.set('strictQuery', false);
const connectDB = async() =>{
    try{
        const conn= await mongoose.connect(process.env.MONGODB_DB)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch(error){
        console.log(error)
    }
}

const saveDB = async(code,token) =>{

    const existingUser = await User.findOne({code: code})
    if (existingUser){
        console.log('The user is already in the DB')
    } else {
        const newUser = new User({
            code: code,
            access_Token: token
        })
        
        await newUser.save()
        console.log('New user saved in the database.')
    }


}

module.exports = {connectDB, saveDB}