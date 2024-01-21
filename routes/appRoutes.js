const { Router } = require('express')
const controller = require('../controllers/appController')

const router = Router();

// routes
router.get('/login',controller.login)
router.get('/spotify',controller.spotify)
router.get('/logged',controller.logged)


module.exports= router