import connectMongoDB from "@/lib/mongodb";
import Posts from "@/models/posts";
import {NextResponse} from "next/server"

//all the api which needs the id
// like PUT 

export async function GET(request,{params}){
    const {id} =  params;
    await connectMongoDB();
    const post = await Posts.findOne({_id:id});
    return NextResponse.json({post},{status: 200});
}