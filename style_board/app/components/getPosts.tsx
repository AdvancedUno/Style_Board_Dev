import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation'
import styles from '@/styles/posts.css'

const GetPosts = async () => {

    const res = await fetch('http://localhost:3000/api/posts',{
        cache: "no-store",
    });

    const {posts} = await res.json();
    // console.log(JSON.parse(posts[10].Links)[0].value);
    // console.log(posts[10]._id);

    return (
        <div className="container mx-auto p-3">
            {
                posts.map((post:any)=>
                    <div className={styles.gridContainer}>
                        <div key={post._id} className="card bg-base-100 w-96 shadow-xl mx-auto">
                            <figure>
                                <img
                                src={`${post.Photo_url}`}
                                alt="Photo" />
                            </figure>
                            <div className="card-body">
                                <h2 className="card-title">{post.Caption}</h2>
                                <p>{post.createdAt}</p>
                                <div className="card-actions justify-end">
                                <button className="btn btn-primary btn-sm w-full max-w-xs">Buy Now</button>
                                </div>
                            </div>
                        </div>                         
                    </div>
               
                )
            }
            

        </div>
    )
}

export default GetPosts