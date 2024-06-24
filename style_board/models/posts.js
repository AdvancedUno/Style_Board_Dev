import mongoose,{ Schema } from "mongoose";

const postSchema = new Schema(
    {
        Caption: String,
        Links: String,
        Photo_url: String,

    },
    {
        timestamps:true,
    }
);

const Posts = mongoose.models.Posts || mongoose.model("Posts", postSchema);

export default Posts;