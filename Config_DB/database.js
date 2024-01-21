const mongoose = require('mongoose')
// mongoose.set('strictQuery', false);
const connectDB = async() =>{
    try{
        const conn= await mongoose.connect(process.env.MONGODB_DB)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch(error){
        console.log(error)
    }
}

const save_DB = async(code,token) =>{
    
}

module.exports = connectDB