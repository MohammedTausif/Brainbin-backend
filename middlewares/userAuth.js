require('dotenv').config()
const jwt = require('jsonwebtoken')


const userAuthMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (decoded) {
        req.userId = decoded.id;
        next()
    } else {
        res.status(403).json({
            message: "You are not loged in" 
        })
    }

}
module.exports = { 
    userAuthMiddleware: userAuthMiddleware 
}