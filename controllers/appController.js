var {statekey, generateRandomString,auth_token} = require('../Authentication/Token')
var {user_info,top_tracks,top_artist} = require('../search/api_search')
var querystring = require('querystring')
const {connectDB, saveDB, searchDB} =require("../Config_DB/database")
require("dotenv").config()

//* spotify platform authentication view
// uses spotify developer account values: client id, scope, redirect_uri
//*
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

// authProcess view, use the logged.ejs template
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

            // get token
            const auth_token_response = await auth_token(code)
            const access_token = auth_token_response.data.access_token;


            // get basic info
            const user_info_response = await user_info(access_token)
            var personal_info = user_info_response.data;
            var id = personal_info.id

            // save in database mongodb
            await saveDB(id,access_token)
            const encodedPersonalInfo = encodeURIComponent(JSON.stringify(personal_info))
            res.redirect(`http://localhost:3000/logged?info=${encodedPersonalInfo}`)


        }
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).render('error', {
            error: 'Internal Server Error'
        });
    }
    
}

// this function is used to search top_artists with api and resend information to frontend
module.exports.artists = async (req, res) => {
    try{
        var id = req.params.id || null
        if(id){
            const artists_response = await top_artist(id)
            var artists = artists_response.data.items 
            res.json(artists)
        }
    }catch(error){
        console.error("Error en la solicitud de canciones:", error);
        res.status(500).json({ error: "Error interno del servidor" })
}};

// this function is used to search top_tracks with api and resend information to frontend
module.exports.songs = async(req,res) =>{ 
    try{
        var id = req.params.id || null;
        if (id){
            const songs_response = await top_tracks(id)
            var songs = songs_response.data.items 
            res.json(songs)
        }
    } catch{
        console.error("Error en la solicitud de canciones:", error);
        res.status(500).json({ error: "Error interno del servidor" })
    }
}