import connectMongoDB from "@/lib/db/mongodb";
import Users from "@/models/users";
import {NextResponse} from "next/server"
import bcrypt from "bcryptjs";

export async function POST(request){
    try{
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
        }

        // Hash the password before creating the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //Uploading to MONGODB
        await connectMongoDB();

        try{
            await Users.create({ username, password : hashedPassword});
        }catch(error){
            console.log(error);
            return NextResponse.json({error: "Error creating User"},{status: 500});
        }
        return NextResponse.json({message: "User created"},{status: 200});

    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Error creating User"},{status: 500});
    }
    
    
}

export async function GET(){
    await connectMongoDB();
    try{
        const users = await Users.find();         
        return NextResponse.json({users},{status: 200});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Error getting users"},{status: 500});
    }

}

// // Example of verifying a hashed password
// const verifyPassword = async (username, plainTextPassword) => {
//   try {
//       const user = await Users.findOne({ username });
//       if (!user) {
//           throw new Error("User not found");
//       }

//       const isMatch = await bcrypt.compare(plainTextPassword, user.password);
//       if (!isMatch) {
//           throw new Error("Invalid credentials");
//       }

//       console.log("Password is valid");
//   } catch (error) {
//       console.error("Error verifying password", error);
//   }
// };