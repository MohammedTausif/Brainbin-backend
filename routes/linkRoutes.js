const express = require('express')
const { userAuthMiddleware } = require('../middlewares/userAuth')
const { HandleLink, getLinkContent } = require('../controllers/Link')
const router = express.Router()

router.post('/share', userAuthMiddleware, HandleLink)
router.get('/:shareLink',getLinkContent)

module.exports = router;