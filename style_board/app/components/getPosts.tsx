'use client';
import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Router from 'next/router'
import '@/styles/posts.css'; 
import Image from 'next/image'
import { SlOptions } from "react-icons/sl";
import Drawer from "./Drawer";

interface PostProps {
    post:{
        _id: string,
        Caption: string;
        Photo_url: string;
        Links: object;
    }

  }

const GetPosts = ({post}:PostProps) => {
    const router = useRouter()

    const handleDelete = async(e:any,id:string) =>{
        e.preventDefault();

        try{
            const res= await fetch(`http://localhost:3000/api/posts?id=${id}`,{
                method: "DELETE",
            });

            window.location.reload();

        }catch(error){
            console.log(error);
        }
        
    }

    // <div className="dropdown indicator-item badge">
    // <div tabIndex={0} role="button" className="">
    //     <SlOptions className="post-ptions" />
    // </div>

    // <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
    //     <li><button onClick={(e)=> handleDelete(e,post._id)}>Delete</button></li>
    //     <li><a>Edit</a></li>
    // </ul>


    return (
        <>
             <div className="post-card overflow-scroll p-1"> {/*onClick={() =>Drawer(true)}> */}
                <div className="">
                    <img src={`${post.Photo_url}`} alt="Photo" className="image" />
                
                {/* on hover body */}
                {/* <div className="body">
                    <h2>d</h2>
                    <p>d</p>
                </div> */}
                
                    <span className="post-caption">{post.Caption}</span>
                    <div className="card-actions justify-end">
                        <span className="badge badge-outline text-xs">Fashion</span>
                        <span className="badge badge-outline text-xs">Products</span>
                    </div>
                </div>
            </div>        
        </>
      
    )
}

export default GetPosts