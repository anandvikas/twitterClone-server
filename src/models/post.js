const mongoose = require('mongoose')
const schema = new mongoose.Schema({
   userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
   },
   parentId: {
      type: mongoose.Types.ObjectId,
      ref: 'Post',
      // required: true
   },
   catagory: {
      type: String,
      enum: ['tweet', 'quotedTweet', 'reply'],
      required: true,
   },

   //-------------------------------------

   comment: {
      type: String,
      required: true
   },

   media: [
      {
         mediaType: {
            type: String,
            enum: ['photo', 'gif', 'quote'],
            required: true
         },
         medialink: {
            type: String,
            requred: true
         }
      }
   ],
   location: {
      type: String
   },

   //-------------------------------------

   viewScope: {
      type: String,
      enum: ['public', 'twitterCircle'],
      required: true,
      default: 'public'
   },
   reTweetedBy: [
      {
         type: mongoose.Types.ObjectId,
         ref: 'User'
      }
   ],

   likedBy: [
      {
         type: mongoose.Types.ObjectId,
         ref: 'User'
      }
   ],

   //-------------------------------------

   replyScope: {
      scope: {
         type: String,
         enum: ['public', 'followers', 'mentioned'],
         required: true,
         default: 'public'
      },
      mentionedPeople: [
         {
            type: mongoose.Types.ObjectId,
            ref: 'User'
         }
      ],
   },
   replies: [
      {
         type: mongoose.Types.ObjectId,
         ref: 'Post'
      }
   ],
},
   {
      timestamps: true
   }
)

const Post = new mongoose.model('Post', schema);
module.exports = Post;