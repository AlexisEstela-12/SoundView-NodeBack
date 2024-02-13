const mongoose = require('mongoose')
const User = require('../models/User')



// database connection
const connectDB = async() =>{
    try{
        const conn= await mongoose.connect(process.env.MONGODB_DB)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch(error){
        console.log(error)
    }
}

// save values in data base
const saveDB = async(id,token) =>{
    const existingUser = await User.findOne({user_id: id})
    if (existingUser){
        console.log('The user is already in the DB')
    } else {
        const newUser = new User({
            user_id: id,
            access_Token: token
        })
        await newUser.save()
        console.log('New user saved in the database.')
    }
}

// search in DB by id
const searchDB = async(id) =>{
    try {   
    const user = await User.findOne({user_id: id})
    return user ? user.access_Token : null
    }catch(error){
        console.error("Error searching in the database: ", error)
        throw error
    }
}



module.exports = {connectDB, saveDB, searchDB}