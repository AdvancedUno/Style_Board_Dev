import connectMongoDB from "@/lib/db/mongodb";
import Posts from "@/models/posts";
import {NextResponse} from "next/server";

export async function POST(request,{params}) {

    const { userId } = await request.json();
    const {id} =  params;

    try {
        await connectMongoDB();

        // Find the post by ID
        const post = await Posts.findById(id);

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Check if the user has already upvoted then do reverse
        if (post.upvotes.includes(userId)) {
            post.upvotes.pull(userId);
            await post.save();
            return NextResponse.json({ error: 'You have already upvoted this post so we pull your upvote' }, { status: 400 });
        }

        // Check if the user has downvoted previously, remove if so
        if (post.downvotes.includes(userId)) {
            post.downvotes.pull(userId);
        }

        // Add user ID to upvotes array
        post.upvotes.push(userId);
        await post.save();

        return NextResponse.json({ message: 'Upvoted successfully', post }, { status: 200 });

    } catch (error) {
        console.error('Error upvoting post:', error);
        return NextResponse.json({ error: 'Error upvoting post' }, { status: 500 });
    }
}

