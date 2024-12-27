const LinkModel = require("../model/Link");
const random = require("../utils/random");
const ContentModel = require("../model/Content");
const UserModel = require("../model/User");

//creating and deleting link
module.exports.HandleLink = async (req, res) => {
    const share = req.body.share;
    const hash = random(12);
    console.log(hash)
    try {
        if (share) {
            const existingLink = await LinkModel.findOne({ userId: req.userId })
            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            else {
                await LinkModel.create({
                    hash: hash,
                    userId: req.userId
                })
                res.json({
                    hash,

                })
            }
        }
        else if (!share) {
            await LinkModel.findOneAndDelete({ userId: req.userId })
            res.json({
                message: "Link deleted successfully "
            })
        }
    }
    catch (error) {
        res.status(403).json({
            message: "error creating link"
        })
    }

}

//get content for shred Link
module.exports.getLinkContent = async (req, res) => {
    const hash = req.params.shareLink
    try {
        const link = await LinkModel.findOne({ hash });
        if (!link) {
            res.status(411).json({
                message: "sorry invalid link"
            })
            return;
        }
        const content = await ContentModel.find({ userId: link.userId });
        const user = await UserModel.findOne({
            _id: link.userId
        })
        if (!user) {
            res.status(411).json({
                message: "user not found, error should ideally not happen"
            })
            return
        }
        else {
            res.json({
                username: user.username,
                content: content,
            })
        }
    } catch (error) {
        res.json({
            message: "error",
            error: error
        })
    }
}