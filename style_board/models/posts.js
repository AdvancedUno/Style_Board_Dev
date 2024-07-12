import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
        Caption: String,
        Links: String,
        Photo_url: String,
        Tags:String,

        //storing all user refrences who upvoted and downvoted on the post
        upvotes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Users' 
        }],
        downvotes: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Users' 
        }]

    },
    {
        timestamps:true,
    }
);

const Posts = mongoose.models.Posts || mongoose.model("Posts", postSchema);

export default Posts;