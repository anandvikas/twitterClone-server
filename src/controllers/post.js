const Post = require("../models/post");

const {
    hashPassword,
    HttpErrorResponse,
    comparePassword,
    generateToken,
    decodeToken,
    generateOTP,
    emailSend
} = require("../helper/helper");


exports.createPost = async (request, response) => {
    const { postPics } = request.files
    const { userId } = request
    let {
        parentId,
        category,
        comment,
        mediaType,
        location,
        viewScope,
        replyScope,
        mentionedPeople
    } = request.body;

    //--------------------------------------
    if (category !== 'tweet') {
        try {
            let isParentExists = await Post.findOne({ _id: parentId })
            if (!isParentExists) {
                HttpErrorResponse({
                    response,
                    status: "error",
                    code: 400,
                    message: "Unable to post #1",
                })
                return;
            }
        } catch (error) {
            console.log(err)
            HttpErrorResponse({
                response,
                status: "error",
                code: 500,
                message: "Unable to post #2",
                data: err
            })
            return;
        }
    }

    //---------------------------------------
    let post;
    let addOns = {}

    if (category === 'reply' || category === 'quotedTweet') {
        addOns.parentId = parentId;
    }

    if (postPics && postPics.length) {
        addOns.media = postPics.map((pic) => {
            return {
                mediaType,
                medialink: pic.path.split('/uploads/')[1]
            }
        })
    }

    if (replyScope) {
        addOns.replyScope = {
            scope: replyScope,
        }
        if (replyScope === 'mentioned' && mentionedPeople) {
            mentionedPeople = JSON.parse(mentionedPeople)
            addOns.replyScope.mentionedPeople = mentionedPeople
        }
    }

    //-------------------------------------------

    try {
        const newPost = new Post(
            {
                userId,
                category,
                comment,
                location,
                viewScope,
                ...addOns
            }
        )
        post = await newPost.save()
    } catch (err) {
        console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Unable to post #3",
            data: err
        })
        return;
    }

    //---------------------------------------

    if (category === 'reply') {
        try {
            await Post.findByIdAndUpdate(parentId, {
                $push: { replies: post._id }
            })
        } catch (err) {
            console.log(err)
            HttpErrorResponse({
                response,
                status: "error",
                code: 500,
                message: "Unable to post #4",
                data: err
            })
            return;
        }
    }

    if (category === 'quotedTweet') {
        try {
            await Post.findByIdAndUpdate(parentId, {
                $push: { quotedTweetBy: userId }
            })
        } catch (err) {
            console.log(err)
            HttpErrorResponse({
                response,
                status: "error",
                code: 500,
                message: "Unable to post #4",
                data: err
            })
            return;
        }
    }

    //---------------------------------------

    response.status(200).json({
        status: "success",
        message: "Post has been created successfully"
    })
}

exports.reTweet = async (request, response) => {
    const { userId } = request;
    const { parentId, action } = request.body
    try {
        if (action === 'add') {
            await Post.findByIdAndUpdate(parentId, {
                $addToSet: { reTweetBy: userId }
            })
        } else if (action === 'remove') {
            await Post.findByIdAndUpdate(parentId, {
                $pull: { reTweetBy: userId }
            })
        } else {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Action not supported #1",
            })
            return;
        }
    } catch (err) {
        console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Unable to perform the action #1",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "Action performed successfully"
    })
}

exports.likePost = async (request, response) => {
    const { userId } = request;
    const { parentId, action } = request.body;

    try {
        if (action === 'like') {
            await Post.findByIdAndUpdate(parentId, {
                $addToSet: { likedBy: userId }
            })
        } else if (action === 'unlike') {
            await Post.findByIdAndUpdate(parentId, {
                $pull: { likedBy: userId }
            })
        } else {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Action not supported #1",
            })
            return;
        }
    } catch (err) {
        console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Unable to perform the action #1",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "Action performed successfully"
    })
}

exports.deletePost = async (request, response) => {
    const { userId } = request;
    const { postId } = request.body;


    try {
        let delRes = await Post.deleteOne({ _id: postId, userId })
        if (!delRes?.deletedCount) {
            HttpErrorResponse({
                response,
                status: "error",
                code: 400,
                message: "Unable to delete #1",
            })
            return;
        }
    } catch (err) {
        console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Unable to delete #2",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "Deleted successfully"
    })
}