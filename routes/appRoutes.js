const { Router } = require('express')
const controller = require('../controllers/appController')

const router = Router();

// routes
router.get('/login',controller.login)
router.get('/authProcess',controller.authProcess)
router.get('/spotify',controller.spotify)
router.get('/logged/:id',controller.logged)
router.get('/getSongs/:id',controller.songs)

module.exports= router