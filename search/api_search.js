require("dotenv").config()
const axios = require('axios')
const {connectDB, saveDB, searchDB} = require("../Config_DB/database")

// function get token
async function user_info(access_Token) {
        const user_info_response = await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': 'Bearer ' + access_Token
            }
        });
        
        return user_info_response;
}

// fucntion get artist
async function top_artist(id){
    const access_token = await searchDB(id)
    const artists = await axios.get("https://api.spotify.com/v1/me/top/artists",{
        headers: {
            'Authorization': 'Bearer ' + access_token,
        },
        params: {
            'limit': 10,
            'offset':5  
        }
    })
    return artists
}

// function get top tracks
async function top_tracks(id){
    const access_token = await searchDB(id)
    const songs = await axios.get( "https://api.spotify.com/v1/me/top/tracks", {
        headers: {
            'Authorization': 'Bearer ' + access_token
                },
        params: {
            'limit': 10,
            'offset':5  
        }
    })
    return songs
}


module.exports = {user_info,top_tracks,top_artist}

