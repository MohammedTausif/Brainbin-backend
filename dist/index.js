"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import 'dotenv/config' 
const dotenv_1 = __importDefault(require("dotenv"));
const UserMiddleware_1 = require("./UserMiddleware");
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("./utils");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const CorsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content", "Authorization"]
};
app.use((0, cors_1.default)(CorsOptions));
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //ZOD
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = yield bcrypt_1.default.hashSync(password, 10);
    console.log("hashedpassword :", hashedPassword);
    try {
        yield db_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.json({
            message: "User Signed Up"
        });
    }
    catch (e) {
        res.status(411).json({
            message: "User already exist in Database "
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    console.log("req reached 1");
    const existingUser = yield db_1.UserModel.findOne({
        username: username
    });
    if (!existingUser) {
        res.status(403).send({
            message: "user does not exist in our DB"
        });
    }
    else if (existingUser) {
        const passwordMatch = yield bcrypt_1.default.compareSync(password, existingUser.password);
        // console.log("passwordmatch: ", passwordMatch)
        try {
            if (passwordMatch) {
                const token = jsonwebtoken_1.default.sign({
                    id: existingUser._id
                }, process.env.JWT_SECRET);
                res.json({
                    token
                });
            }
            else {
                res.status(403).send({
                    message: "wrong password "
                });
            }
        }
        catch (e) {
            res.status(403).json({
                message: "Invalid credentials"
            });
        }
    }
}));
app.post("/api/v1/content", UserMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield db_1.ContentModel.create({
            title: req.body.title,
            link: req.body.link,
            type: req.body.type,
            userId: req.userId,
            desc: req.body.desc,
        });
        res.json({
            message: "Content Added"
        });
    }
    catch (e) {
        res.status(403).json({
            message: "Error Adding content "
        });
    }
}));
app.get("/api/v1/content", UserMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const content = yield db_1.ContentModel.find({
            userId: req.userId
        }).populate("userId", "username");
        res.json({
            content
        });
    }
    catch (_a) {
        res.json({
            message: "no content available"
        });
    }
}));
app.put("/api/v1/content", UserMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.body.contentId;
    const title = req.body.title;
    const type = req.body.type;
    const link = req.body.link;
    const desc = req.body.desc;
    const userId = req.userId;
    try {
        if (userId && _id) {
            const response = yield db_1.ContentModel.findOneAndUpdate({
                _id,
                title,
                link,
                desc,
                type
            });
            console.log(response);
            res.json({
                message: "content updated succesfully"
            });
        }
        else {
            res.status(403).json({
                message: "content cant be updated"
            });
        }
    }
    catch (error) {
        res.status(403).json({
            message: error
        });
    }
}));
app.delete("/api/v1/content", UserMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    try {
        const response = yield db_1.ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        });
        console.log("contentID : ", contentId);
        console.log("delete response", response);
        res.json({
            message: "content deleted"
        });
    }
    catch (e) {
        res.status(403).json({
            message: "could not delete"
        });
    }
}));
app.post("/api/v1/brain/share", UserMiddleware_1.UserMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const eixstingLink = yield db_1.LinkModel.findOne({
            userId: req.userId,
        });
        if (eixstingLink) {
            res.json({
                hash: eixstingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(12);
        yield db_1.LinkModel.create({
            userId: req.userId,
            hash: hash,
        });
        res.json({
            hash
        });
    }
    else if (!share) {
        yield db_1.LinkModel.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "link Removed"
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "sorry incorrect link"
        });
        return;
    }
    const content = yield db_1.ContentModel.find({
        userId: link.userId
    });
    const user = yield db_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "user not found"
        });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
try {
    app.listen(3000, () => {
        console.log("server started at 3000");
    });
}
catch (e) {
    console.log(e);
}
