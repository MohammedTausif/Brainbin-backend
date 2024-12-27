const UserModel = require("../model/User");
const bcrypt = require('bcrypt')
require('dotenv').config()
const jwt = require('jsonwebtoken')

const signup = async (req, res) => {
    const { username, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 7)

    const existingUser = await UserModel.findOne({
        username: username,
    })
    if (existingUser) {
        res.status(400).json({
            message: "User already exist in Database"
        })
        return
    }
    try {
        await UserModel.create({
            username: username,
            password: hashPassword,
        })
        console.log("user signed up")
        res.json({
            message: "Signed Up"
        })
    } catch (error) {
        console.error(error)
        res.status(403).json({
            message: "Error creating user :", error,
            error: error
        })

    }

}

const signin = async (req, res) => {
    const { username, password } = req.body;

    const user = await UserModel.findOne({
        username: username,
    })
    console.log("req reached 1")
    if (!user) {
        res.status(403).json({
            message: "User doesnt exist or invalid username"
        })
        return
    } console.log("req reached 2")
    try {
        const passwordMatch = await bcrypt.compare(password, user.password)
        console.log("req reached 3")
        if (passwordMatch) {

            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET)
            console.log("user signed in : ", token)

            res.json({
                token,
                message: "You have signed in "
            })

        }
    } catch (error) {
        res.status(403).json({
            message: "invalid Credentials / Password ",
            error: error
        })
    }

}

module.exports = {
    signin: signin,
    signup: signup
}
