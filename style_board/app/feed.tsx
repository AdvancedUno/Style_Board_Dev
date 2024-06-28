import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import '@/styles/posts.css'; 
import Image from 'next/image';
import GetPosts from "./components/getPosts";
import '@/styles/posts.css'; 
import Drawer from './components/Drawer';

const GetFeed = async () => {

    const res = await fetch('http://localhost:3000/api/posts',{
        cache: "no-store",
    });
  
    const {posts} = await res.json();
    // console.log(JSON.parse(posts[10].Links)[0].value);
    // console.log(posts[10]._id);
    return (
        <div className="grid grid-cols-4">
           <div className="columns-3xs gap-2 p-2 col-span-3">  {/* col-span-2 for half */}
                {posts.map((post:any)=>
                    <GetPosts
                        key={post._id}
                        post={post}
                    
                    />
                )
                }
  
            </div>  
            <div className="">
                
            </div>

        </div>


    )
}

export default GetFeed