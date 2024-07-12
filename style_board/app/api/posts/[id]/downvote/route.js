import connectMongoDB from "@/lib/db/mongodb";
import Posts from "@/models/posts";
import {NextResponse} from "next/server";

export async function POST(request,{params}) {

    const { userId } = await request.json();
    const {id} =  params;
    console.log(id);

    try {
        await connectMongoDB();

        // Find the post by ID
        const post = await Posts.findById(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if the user has already downvoted
        if (post.downvotes.includes(userId)) {
            post.downvotes.pull(userId);
            await post.save();
            return NextResponse.json({ error: 'You have already upvoted this post  so we pull your downvote', post  }, { status: 400 });
        }

        // Check if the user has upvoted previously, remove if so
        if (post.upvotes.includes(userId)) {
            post.upvotes.pull(userId);
        }

        // Add user ID to downvotes array
        post.downvotes.push(userId);
        await post.save();

        return NextResponse.json({ message: 'Downvoted successfully', post }, { status: 200 });

    } catch (error) {
        console.error('Error Downvoting post:', error);
        return NextResponse.json({ error: 'Error diwnvoting post' }, { status: 500 });
    }
}