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

const { default: mongoose } = require("mongoose");

const postTweet = async (request, response) => {

    // console.log(postPics)
    // console.log(request.body)

    const { postPics } = request.files
    const {
        userId,
        // parentId,
        catagory,
        comment,
        mediaType,
        location,
        viewScope,
        // reTweetedBy,
        // likedBy,
        replyScope,
        mentionedPeople
        // replies
    } = request.body

    let addOns = {}

    if (postPics && postPics.length) {
        addOns.media = postPics.map((pic) => {
            return {
                mediaType,
                medialink: pic.path.split('/uploads/')[1]
            }
        })
    }

    addOns.replyScope = {
        scope: replyScope,
    }

    if (replyScope === 'mentioned') {
        addOns.replyScope.mentionedPeople = mentionedPeople
    }

    try {
        const newPost = new Post(
            {
                userId,
                catagory,
                comment,
                mediaType,
                location,
                viewScope,
                ...addOns
            }
        )
        await newPost.save()
    } catch (err) {
        // console.log(err)
        HttpErrorResponse({
            response,
            status: "error",
            code: 500,
            message: "Cannot create the Post",
            data: err
        })
        return;
    }
    response.status(200).json({
        status: "success",
        message: "Post has been created successfully"
    })
}

const postQuotedTweet = async (request, response) => {

}

const postReply = async (request, response) => {

}

exports.postGuide = async (request, response) => {

    const { catagory } = request.body;

    if (catagory === 'tweet') {
        postTweet(request, response)
        return
    }
    if (catagory === 'quotedTweet') {
        postQuotedTweet(request, response)
        return
    }
    if (catagory === 'reply') {
        postReply(request, response)
        return
    }

    HttpErrorResponse({
        response,
        status: "error",
        code: 400,
        message: "Cannot post",
    })
    return;
}