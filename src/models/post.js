const mongoose = require('mongoose')

const quotedTweetSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: true
   }
}, {
   timestamps: true
}
)

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
   category: {
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
      // required: true,
      default: 'public'
   },
   reTweetBy: [
      {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: true
      }
   ],
   quotedTweetBy: [
      {
         type: mongoose.Types.ObjectId,
         ref: 'User',
         required: true
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
         // required: true,
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