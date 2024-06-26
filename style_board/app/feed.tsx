import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import '@/styles/posts.css'; 
import Image from 'next/image';
import GetPosts from "./components/getPosts";

const GetFeed = async () => {
    const res = await fetch('http://localhost:3000/api/posts',{
        cache: "no-store",
    });
  
    const {posts} = await res.json();
    // console.log(JSON.parse(posts[10].Links)[0].value);
    // console.log(posts[10]._id);
    return (
        <div className="mx-auto p-4">
           <div className="post-grid-container"> 
                {posts.map((post:any)=>
                    <GetPosts
                        key={post._id}
                        post={post}
                    
                    />
                )
            }
            </div>

        </div>
    )
}

export default GetFeed