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
    following: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                required: true
            }

        }
    ],
    followers: [
        {
            userId: {
                type: mongoose.Types.ObjectId,
                required: true
            }

        }
    ],
    loginTokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ],
    resetPasswordToken:{
        type:String
    },
    active: {
        type: Boolean,
        require: true,
        default: true
    },


},
    {
        timestamps: true
    }
);

const User = new mongoose.model('User', schema);
module.exports = User;