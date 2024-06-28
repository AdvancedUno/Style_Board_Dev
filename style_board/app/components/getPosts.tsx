'use client';
import React, { useState, useRef,useEffect } from "react";
import { useRouter } from 'next/navigation';
import Router from 'next/router'
import '@/styles/posts.css'; 
import Image from 'next/image'
import { SlOptions } from "react-icons/sl";

interface Post {
  _id: string;
  Caption: string;
  Photo_url: string;
  Links: string;
  // Add more properties if needed
}
const GetPosts = () => {
    const router = useRouter();
    const [posts,setPosts] = useState([{
        Links:[]
    }]);
    const [isOpen,setIsOpen] = useState(false);
    const [seletedPost,setSelectedPost] = useState([{}]);
    const [links,setLinks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('http://localhost:3000/api/posts',{
                cache: "no-store",
            });
        
            const data = await res.json();  

            // Assuming `Links` is a stringified JSON array
            const parsedPosts = data.posts.map((post:any) => ({
                ...post,
                Links: JSON.parse(post.Links),
            }));
  
          setPosts(parsedPosts);
 
  
        };
      
        // Call the async function
        fetchData();
      }, [setPosts]);

    // console.log(JSON.parse(posts[10].Links)[0].value);
    // console.log(posts[10]._id);

    const handleDelete = async(e:any,id:string) =>{
        e.preventDefault();
        const len_url=seletedPost.Photo_url.split("/").length
        const key=seletedPost.Photo_url.split("/")[len_url-1];
        console.log(key);
        try{
            const res= await fetch(`http://localhost:3000/api/posts?id=${id}&key=${key}`,{
                method: "DELETE",
            });

            window.location.reload();

        }catch(error){
            console.log(error);
        }

        
    }

    const handleDrawer = (index:number) => {
        
        setIsOpen(true);
        setSelectedPost(posts[index]);
        setLinks(posts[index].Links);
        // console.log(JSON.parse(posts[index].Links));
        // console.log(JSON.parse(seletedPost.Links)[0].value);
    }


    return (
        <>
            <div className="grid grid-cols-4">
                <div className={`gap-2 p-2 ${isOpen?'col-span-3 columns-3xs': 'col-span-4 columns-3xs'}`}>  {/* col-span-2 for half */}
                    {posts.map((post:any,index)=>
                        <div className="post-card 
                        overflow-scroll p-1" onClick={()=> handleDrawer(index)}>
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
                                    {/* <div>
                                    {post.Links.map((link:any,i:number) =>

                                        <div className="">
                                        {link.value}
                                        </div>

                                    )}

                                </div> */}
                                </div>
                            </div>
                        </div>  
                    )
                    }

                </div>  
                <div className="col-span-2">
                    <div className={`fixed top-0 right-0 w-96 h-full bg-white shadow-lg transition-transform transform  overflow-scroll xl:w-100
                        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="p-4">
                            <button className="btn btn-square btn-sm" onClick={()=>{setIsOpen(false)}} >✕</button>
                        </div>

                        {/* inner card */}
                        <div className="p-1">
                            <div className="static">
                                <div className="dropdown dropdown-start indicator-item badge absolute top-50">
                                    <div tabIndex={0} role="button" className="">
                                        <SlOptions className="post-ptions" />
                                    </div>

                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li><button onClick={(e)=> handleDelete(e,seletedPost._id)}>Delete</button></li>
                                        <li><a>Edit</a></li>
                                    </ul>
                                </div>
                                <img src={`${seletedPost.Photo_url}`} alt="Photo" className="image" />                                
                            </div>


                            <div className="p-1">
                                <span className="post-caption">{seletedPost.Caption}</span>

                                {/* tages  */}
                                <div className="card-actions justify-end">
                                    <span className="badge badge-outline text-xs">Fashion</span>
                                    <span className="badge badge-outline text-xs">Products</span>
                                </div>
                            </div>
                        </div>  
                        <div>
                            {links.map((link:any) =>

                                <div className=" bg-base-100 w-96 shadow-xl">
                                <div className="card-body">
                                    <h2 className="card-title">Card title!</h2>
                                    <p className="overflow-hidden">{link.value}</p>
                                    <div className="card-actions justify-end">
                                    <a className="btn btn-primary" href={`${link.value}`}>Buy Now</a>
                                    </div>
                                </div>
                                </div>

                            )}

                        </div>



                    </div>  
                </div>
  
            </div>
      
        </>
      
    )
}

export default GetPosts