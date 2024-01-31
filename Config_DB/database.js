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

const saveDB = async(id,token,expires_at,refresh_token) =>{
    const existingUser = await User.findOne({user_id: id})
    if (existingUser){
        console.log('The user is already in the DB')
    } else {
        const newUser = new User({
            user_id: id,
            access_Token: token,
            refresh_Token: refresh_token,
            expires_at: expires_at,

        })
        
        await newUser.save()
        console.log('New user saved in the database.')
    }
}

const searchDB = async(id) =>{
    try {
        
    const user = await User.findOne({user_id: id})
    console.log(user)
    if (user){
        var currentTime = new Date();
        // console.log(currentTime,"este es el valor de currentTime")
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
            console.log("aun no se vence")
            return user ? user.access_Token : null
        }
    }
    
    }  catch(error){
        console.error("Error searching in the database: ", error)
        throw error
    }
}

const UpdateDB = async(id,token,expire_in,refresh_token) =>{

    try{
        const user = await User.findOneAndUpdate(
            {user_id:id},
            {$set:{access_Token: token, expiration_date: expire_in, refresh_Token: refresh_token }}, 
            {new:true}
        )
        if (user){
            console.log("Successfully updated user")
        }
    }catch(error){
        console.log(error)
    }

}


module.exports = {connectDB, saveDB, searchDB}