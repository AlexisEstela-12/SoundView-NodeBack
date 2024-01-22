var {statekey, generateRandomString,auth_token} = require('../Authentication/Token')
var {user_info,top_tracks,top_artist} = require('../search/api_search')
var cookie = require('cookie-parser')
var querystring = require('querystring')
require("dotenv").config()
var request = require('request')
const axios = require('axios')
const User = require('../models/User')

// login task
module.exports.login= (req,res) =>{
    res.render("login",{})
    }



// spotify login   
module.exports.spotify = (req,res) => {
    var state = generateRandomString(16);
    res.cookie(statekey,state)
    var scope = 'user-read-private user-read-email,user-top-read ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-library-modify user-library-read'
    res.redirect('https://accounts.spotify.com/authorize?'+ querystring.stringify({
        response_type: 'code',
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.REDIRECT_URL,
        state: state
}))
}


// logged task
module.exports.logged = async (req, res) => {
    try {
        var code = req.query.code || null;
        var state = req.query.state || null;
        var savedState = req.cookies ? req.cookies[statekey] : null;

            // verified state for security
        if (state === null || state !== savedState) {
            res.redirect('/#' +
                querystring.stringify({
                    error: 'state_mistmatch'
                }));
        } else {
            // clean cookies
            res.clearCookie(statekey);


            // get token
            const auth_token_response = await auth_token(code)
            const access_token = auth_token_response.data.access_token;

            // get basic info
            const user_info_response = await user_info(access_token)
            var personal_info = user_info_response.data;


            // get top songs
            const artists_response = await top_artist(access_token)
            var artists = artists_response.data.items
            
            const songs_response = await top_tracks(access_token)
            var songs = songs_response.data.items 
        }
            // render basic info in logged page
        res.render("logged", {
            personal_info,
            artists,
            songs
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
};

