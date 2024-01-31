require("dotenv").config()
var crypto = require('crypto')
var querystring = require('querystring');
const axios = require('axios')

// generate random string 
var generateRandomString = (length) =>{
    return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0,length)
}

// save state authentication
var statekey = 'spotify_auth_state'


// get token
async function auth_token(code){
    
    const auth_token_response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
                    code: code,
                    redirect_uri: process.env.REDIRECT_URL,
                    grant_type: 'authorization_code'
                }), {
                    headers: {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Basic ' + (Buffer.from(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
                    }
                });
            return auth_token_response
            }

async function refresh_token(refreshToken){
    
    try{
    const response = await axios.post("https://accounts.spotify.com/api/token", {
        grant_type: "refresh_token",
        refreshToken: refreshToken,
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET
    })
    const newAccessToken = response.data.access_token
    const expiresIn  = response.data.expires_in
    const newRefreshToken = response.data.refresh_token
    var d = new Date()
    var expiresAt =  new Date(d.getTime()+ expiresIn*1000- 18000000) 

    return {newAccessToken, expiresAt,newRefreshToken}
    }catch(error){
        console.log(error)
    }
    
}

module.exports = {statekey, generateRandomString, auth_token,refresh_token}
