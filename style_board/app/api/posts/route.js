import connectMongoDB from "@/lib/db/mongodb";
import Posts from "@/models/posts";
import {NextResponse} from "next/server"
import { PutObjectCommand, S3Client,DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    }
});

async function uploadFileToS3(file,fileName,folderName){
    const fileBuffer = file;
    //your do `folderName/${fileName}-${Date.now()}` to create chunk
    const key_url=`${folderName}/${fileName}-${Date.now()}`;
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        
        Key: key_url,
        Body: fileBuffer,
        ContentType: "image/jpeg",
    }
    
    const command = new PutObjectCommand(params);
    try{
        const res = await s3Client.send(command);
    }catch(error){
        console.log(error);
    }
    

    return key_url;
}


export async function POST(request){
    try{
        const formData = await request.formData();
        const files = formData.getAll("Photo");
        const links = formData.get("Links");

        if(!files){
            console.log("here");
            return NextResponse.json({error: "file and link is required"},{status: 400});
        }
        const folderName=`${files[0].name}@${Date.now()}`
        const uploadedUrls = await Promise.all(files.map(async (file) => {
            const buffer = Buffer.from(await file.arrayBuffer());
            const key_url = await uploadFileToS3(buffer, file.name,folderName);
            return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key_url}`;
        }));
        
        //Uploading to MONGODB
        await connectMongoDB();
        const photoUrls = JSON.stringify(uploadedUrls);

        // console.log(formData.get("Links"));
        try{
            await Posts.create({Caption: formData.get("Caption"),Links: links,Photo_url:photoUrls});
        }catch(error){
            console.log(error);
        }
        return NextResponse.json({message: "Post created"},{status: 200});

    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Error creating Post"},{status: 500});
    }
    
    
}

export async function GET(){
    await connectMongoDB();
    try{
        const posts = await Posts.find();         
        return NextResponse.json({posts},{status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Error getting posts"},{status: 500});
    }

}

export async function DELETE(request){
    const id = request.nextUrl.searchParams.get("id");
    const key = request.nextUrl.searchParams.get("key");
    await connectMongoDB();
    try{
        //deleting post in MongoDB
        await Posts.findByIdAndDelete(id);      

        //deleting the post photo from the AWS 
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        }
        
        const command = new DeleteObjectCommand(params);
        try{
            const res = await s3Client.send(command);
        }catch(error){
            console.log(error);
        }


        return NextResponse.json({message:`Post deleted of id: ${id}`},{status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Error deleting posts"},{status: 500});
    }


}

