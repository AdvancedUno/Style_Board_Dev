'use client';
import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation';
import Router from 'next/router'
import '@/styles/posts.css'; 
import Image from 'next/image'
import { SlOptions } from "react-icons/sl";

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


    return (
        <div className="card card-bordered w-96 card-compact bg-base-300 shadow-lg indicator"
        style={{
            // ['maxHeight' as any]:"300px",
            // ['maxWidth' as any ]:"305px"
        }}>
            
            <figure>
                <div className="dropdown indicator-item badge">
                    <div tabIndex={0} role="button" className="">
                        <SlOptions className="post-ptions" />
                    </div>

                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                        <li><button onClick={(e)=> handleDelete(e,post._id)}>Delete</button></li>
                        <li><a>Edit</a></li>
                    </ul>
                </div>
                <img 
                style={{
                    // ['max-height' as any]:"170px",
                    // ['max-width' as any ]:"259px"
                }}
                src={`${post.Photo_url}`}
                alt="Photo" />
            </figure>
            <div className="card-body">
                {/* <h2 className="card-title">{post.Caption}</h2> */}
                {/* <p>{post.createdAt}</p> */}
                <span className="post-caption"> {post.Caption} </span>
                <div className="card-actions justify-end">
                    <div className="badge badge-outline">Fashion</div>
                    <div className="badge badge-outline">Products</div>
                    
                </div>
                <button className="btn btn-primary btn-sm w-full max-w-xs self-center">Buy Now</button>
            </div>
        </div>   
    )
}

export default GetPosts