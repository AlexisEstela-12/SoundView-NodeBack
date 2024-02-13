const { Router } = require('express')
const controller = require('../controllers/appController')

const router = Router();

// routes
router.get('/authProcess',controller.authProcess)
router.get('/spotify',controller.spotify)
router.get('/getArtists/:id',controller.artists)
router.get('/getSongs/:id',controller.songs)

module.exports= router