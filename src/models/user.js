const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    userName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    profilePic: {
        type: String,
        default: 'profilePics/noAvatar.png'
    },
    following: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    followers: [
        {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    loginTokens: [
        {
            type: String,
            required: true
        }
    ],
    
    resetPasswordToken: {
        type: String
    },

    active: {
        type: Boolean,
        require: true,
        default: true
    },
    // extras...
    spokenLanguages:[
        // eg. hindi, eng 
    ],
    interests:[
        // eg. movies, sports, politics 
    ],
    sybInterests:[
        // eg. action, football, modi ji 
    ],


},
    {
        timestamps: true
    }
);

const User = new mongoose.model('User', schema);
module.exports = User;