var {statekey, generateRandomString,auth_token,refresh_token} = require('../Authentication/Token')
var {user_info,top_tracks,top_artist} = require('../search/api_search')
var cookie = require('cookie-parser')
var querystring = require('querystring')
require("dotenv").config()
var request = require('request')
const axios = require('axios')
const User = require('../models/User')
const {connectDB, saveDB, searchDB} =require("../Config_DB/database")
const moment = require('moment-timezone')

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

module.exports.authProcess = async (req,res) =>{
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

            // get token, refresh_token and expiration time
            const auth_token_response = await auth_token(code)
            const access_token = auth_token_response.data.access_token;
            const refresh_token = auth_token_response.data.refresh_token;
            const expires_in = auth_token_response.data.expires_in;

            // se le resta 5h porque en el horario de Perú son 6h de diferencia, pero el token dura 1h.
            var d = new Date()
            var Expiration_time = new Date(d.getTime()+ expires_in*1000- 18000000) 

        

            // get basic info
            const user_info_response = await user_info(access_token)
            var personal_info = user_info_response.data;
            var id = personal_info.id
            saveDB(id,access_token,Expiration_time,refresh_token)
            var userData = {
                name: personal_info.display_name,
                email: personal_info.email,
                account: personal_info.href,
                country: personal_info.country,
                followers:personal_info.followers.total,
                image: personal_info.image
            }
            req.session.userData = userData
            res.redirect(`/logged/${id}`) 
        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
    
}
module.exports.logged = async (req, res) => {
    const userData = req.session.userData
    const id = req.params.id
    const artists_response = await top_artist(id)
    var artists = artists_response.data.items
    res.render ("logged",{
        userData,
        artists
    })
};

module.exports.songs = async(req,res) =>{ 
    try{
        var id = req.params.id || null;
        if (id){
            const songs_response = await top_tracks(id)
            var songs = songs_response.data.items 
            res.json(songs)

        }
    } catch{
        console.log("error")

    }
}