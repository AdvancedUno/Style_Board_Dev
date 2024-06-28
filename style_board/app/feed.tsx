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
            <div className="drawer drawer-end">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-primary">Open drawer</label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li><a>Sidebar Item 1</a></li>
                    <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
                </div>
            </div>

        </div>


    )
}

export default GetFeed