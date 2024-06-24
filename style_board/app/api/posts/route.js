import connectMongoDB from "@/lib/db/mongodb";
import Posts from "@/models/posts";
import {NextResponse} from "next/server"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACESS_KEY,
    }
});

async function uploadFileToS3(file,fileName){
    const fileBuffer = file;
    
    const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${fileName}-${Date.now()}`,
        Body: fileBuffer,
        ContentType: "image/*",
    }
    
    const command = new PutObjectCommand(params);
    try{
        const res = await s3Client.send(command);
    }catch(error){
        console.log(error);
    }
    // console.log(res);

    return fileName;
}


export async function POST(request){
    try{
        const formData = await request.formData();
        const file = formData.get("Photo");
  
        if(!file){
            return NextResponse.json({error: "file is required"},{status: 400});
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        //uploading the image file to AWS
        const res = await uploadFileToS3(buffer,file.name);
        
        //Uploading to MONGODB
        console.log(res);
        
        return NextResponse.json({message: "Post created"});

    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Error creating Post"},{status: 500});
    }
    
    
}

export async function GET(){
    await connectMongoDB();
    const Posts = await Posts.find();
    return NextResponse.json({Posts});
}

