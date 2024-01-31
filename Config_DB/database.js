const mongoose = require('mongoose')
const User = require('../models/User')
var {statekey, generateRandomString,auth_token,refresh_token} = require('../Authentication/Token')


const connectDB = async() =>{
    try{
        const conn= await mongoose.connect(process.env.MONGODB_DB)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch(error){
        console.log(error)
    }
}

const saveDB = async(id,token,refresh_token) =>{
    const existingUser = await User.findOne({user_id: id})
    if (existingUser){
        console.log('The user is already in the DB')
    } else {
        const newUser = new User({
            user_id: id,
            access_Token: token,
            refresh_Token: refresh_token,

        })
        
        await newUser.save()
        console.log('New user saved in the database.')
    }
}

const searchDB = async(id) =>{
    try {
        
    const user = await User.findOne({user_id: id})
    if (user){
        var currentTime = new Date();
        var own_CurrentTime = new Date(currentTime.getTime() - 18000000)
        if (own_CurrentTime > user.expiration_time){
            print("ya se vencio")
            const result =  await refresh_token(user.refresh_Token)
                console.log(result.newAccessToken)
                console.log(result.expiresAt)
                console.log(result.newRefreshToken)
            await UpdateDB(id,result.newAccessToken,result.expiresAt,result.newRefreshToken)
            await searchDB(id)
            
        }
        else{
            return user ? user.access_Token : null
        }
    }
    
    }  catch(error){
        console.error("Error searching in the database: ", error)
        throw error
    }
}



module.exports = {connectDB, saveDB, searchDB}