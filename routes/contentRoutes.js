const express = require('express')
const { userAuthMiddleware } = require('../middlewares/userAuth')
const { getContent, postContent, updateContent, deleteContent } = require('../controllers/Content')
const router = express.Router()

router.post("/content", userAuthMiddleware, postContent)
router.get("/content", userAuthMiddleware, getContent)
router.put("/content",userAuthMiddleware, updateContent)
router.delete("/content", userAuthMiddleware, deleteContent)

module.exports = router;