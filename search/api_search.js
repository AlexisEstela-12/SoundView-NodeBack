require("dotenv").config()
const axios = require('axios')

// function get token
async function user_info(access_token){
    const user_info_response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    });

    return user_info_response
    }

// fucntion get artist
async function top_artist(access_token){
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
async function top_tracks(access_token){
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



// "https://api.spotify.com/v1/artists/0TnOYISbd1XYRBk9myaseg"