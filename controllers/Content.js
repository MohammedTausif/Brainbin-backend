const ContentModel = require('../model/Content')

//Post Content: Create
module.exports.postContent = async (req, res) => {
    const { title, type, link, desc } = req.body
    const userId = req.userId

    try {
        await ContentModel.create({
            title,
            link,
            desc,
            type,
            userId
        })
        res.json({
            message: "Content Added Successfully "
        })
    }
    catch (error) {
        res.status(403).json({
            message: "Error Adding content",
            error: error,
        })
    }
}


//Get Content: Read
module.exports.getContent = async (req, res) => {
    const userId = req.userId
    try {
        const content = await ContentModel.find({ userId }).populate("userId", "username")
        res.json({
            content
        })
    } catch (error) {
        res.status(403).json({
            message: "No content found",
            error: error
        })
    }
}

// Update Content : Update
module.exports.updateContent = async (req, res) => {
    const userId = req.userId;
    const contentId = req.body.contentId;

    try {
        await ContentModel.findOneAndUpdate({
            _id: contentId,
            userId
        })
        res.json({
            message: "content Updates"
        })
    } catch (error) {
        res.status(403).json({
            message: "content couldn't be updated"
        })
    }
}

//Delete Content : Delete

module.exports.deleteContent = async(req, res)=>{
    const contentId = req.body.contentId;
    const userId = req.userId;
    try{
        await ContentModel.findOneAndDelete({
            _id: contentId,
            userId: userId
        })
        res.json({
            message: "content deleted"
        })

    }catch(error){
        res.status(403).json({
            message: "Content couldn't be deleted",
            error: error,
        })

    }

}