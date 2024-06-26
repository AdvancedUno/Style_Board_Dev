import connectMongoDB from "@/lib/db/mongodb";
import Posts from "@/models/posts";
import {NextResponse} from "next/server"

//all the api which needs the id
// like PUT 

export async function GET(request,{params}){
    const {id} =  params;
    await connectMongoDB();
    try{
        const post = await Posts.findOne({_id:id});
        return NextResponse.json({post},{status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:`Error getting the post of ${id}`},{status: 500});
    }

}

export async function PUT(request,{params}){
  
    const {id} =  params;
    const { newCaption: caption} = await request.json();

    await connectMongoDB();
    try{
        await Posts.findByIdAndUpdate(id, {Caption: caption} );
        return NextResponse.json({message: `Post caption updated with :${caption} `},{status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error:`Error updating the post of ${id}`},{status: 500});
    }

}