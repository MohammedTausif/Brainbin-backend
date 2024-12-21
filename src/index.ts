import express from "express";
import { ContentModel, LinkModel, UserModel } from "./db";
import jwt from 'jsonwebtoken';
import { compareSync, hashSync } from "bcrypt";
// import 'dotenv/config' 
import dotenv from 'dotenv'
import { UserMiddleware } from "./UserMiddleware";
import cors from 'cors';
import bcrypt from 'bcrypt';
import { random } from "./utils";

dotenv.config();
const app = express()
app.use(express.json())
app.use(cors())


app.post("/api/v1/signup", async (req, res) => {
    //ZOD
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = await bcrypt.hashSync(password, 10)
    console.log("hashedpassword :", hashedPassword)

    try {
        await UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.json({
            message: "User Signed Up"
        });
    } catch (e) {
        res.status(411).json({
            message: "User already exist in Database "
        })

    }
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log("req reached 1")

    const existingUser = await UserModel.findOne({
        username: username
    })

    if (!existingUser) {
        res.status(403).send({
            message: "user does not exist in our DB"
        })
    }
    else if (existingUser) {
        const passwordMatch = await bcrypt.compareSync(password, existingUser.password as string)
        // console.log("passwordmatch: ", passwordMatch)
        try {
            if (passwordMatch) {
                const token = jwt.sign({
                    id: existingUser._id
                }, process.env.JWT_SECRET)
                res.json({
                    token
                })
            }
            else {
                res.status(403).send({
                    message: "wrong password "
                })
            }

        } catch (e) {
            res.status(403).json({
                message: "Invalid credentials"
            })
        }
    }
})

app.post("/api/v1/content", UserMiddleware, async (req, res) => {

    try {
        await ContentModel.create({
            title: req.body.title,
            link: req.body.link,
            type: req.body.type,
            userId: req.userId,
            desc: req.body.desc,

        })
        res.json({
            message: "Content Added"
        })
    } catch (e) {
        res.status(403).json({
            message: "Error Adding content "
        })
    }

})


app.get("/api/v1/content", UserMiddleware, async (req, res) => {
    try {
        const content = await ContentModel.find({
            userId: req.userId
        }).populate("userId", "username")
        res.json({
            content
        })
    } catch {
        res.json({
            message: "no content available"
        })
    }

})
app.put("/api/v1/content", UserMiddleware, async (req, res) => {
    const _id = req.body.contentId
    const title = req.body.title
    const type = req.body.type
    const link = req.body.link
    const desc = req.body.desc
    const userId = req.userId
    try {
        if (userId && _id) {
            const response = await ContentModel.findOneAndUpdate({
                _id,
                title,
                link,
                desc,
                type
            })
            console.log(response)
            res.json({
                message: "content updated succesfully"
            })

        } else {
            res.status(403).json({
                message: "content cant be updated"
            })
        }
    } catch (error) {
        res.status(403).json({
            message: error
        })
    }

})

app.delete("/api/v1/content", UserMiddleware, async (req, res) => {
    const contentId = req.body.contentId
    try {
        const response = await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        })
        console.log("contentID : ", contentId)
        console.log("delete response", response)
        res.json({
            message: "content deleted"
        })
    }
    catch (e) {
        res.status(403).json({
            message: "could not delete"
        })
    }
})

app.post("/api/v1/brain/share", UserMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const eixstingLink = await LinkModel.findOne({
            userId: req.userId,
        })
        if (eixstingLink) {
            res.json({
                hash: eixstingLink.hash
            })
            return
        }
        const hash = random(12);
        await LinkModel.create({
            userId: req.userId,
            hash: hash,
        })
        res.json({
            hash
        })
    } else if(!share){
        await LinkModel.deleteOne({
            userId: req.userId
        })
        res.json({
            message: "link Removed"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    })
    if (!link) {
        res.status(411).json({
            message: "sorry incorrect link"
        })
        return
    }
    const content = await ContentModel.find({
        userId: link.userId
    })
    const user = await UserModel.findOne({
        _id: link.userId

    })
    if (!user) {
        res.status(411).json({
            message: "user not found"
        })
        return;
    }
    res.json({
        username: user.username,
        content: content
    })

})





try {

    app.listen(3000, () => {
        console.log("server started at 3000")
    })
} catch (e) {
    console.log(e)
} 