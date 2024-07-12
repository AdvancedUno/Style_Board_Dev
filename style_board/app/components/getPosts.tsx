'use client';
import React, { useState, useRef,useEffect } from "react";
import { useRouter } from 'next/navigation';
import Router from 'next/router'
import '@/styles/posts.css'; 
import Image from 'next/image'

import LoadingPage from '.././loading';

import cheerio from 'cheerio';

//React Icons
import { SlOptions } from "react-icons/sl";
import { BiUpvote, BiSolidUpvote , BiDownvote , BiSolidDownvote} from "react-icons/bi";



const GetPosts = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter();

    const [posts,setPosts] = useState([{
        Photo_url:[],
        Links:[],
        Tags:[],
    }]);

    const [displayCaption,setDisplayCaption] = useState(false);

    const [isOpen,setIsOpen] = useState(false);
    const [isLoading,setIsLoading] = useState(true);
    const [isLoadingPosts,setIsLoadingPosts] = useState(true);
    const [seletedPost,setSelectedPost] = useState([{
        Photo_url:[]
    }]);
    const [links,setLinks] = useState([]);
    const [updateCaption, setUpdateCaption] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try{
                const res = await fetch('/api/posts',{
                    cache: "no-store",
                });
            
                const data = await res.json();  

                // Assuming `Links` is a stringified JSON array
                const parsedPosts = data.posts.map((post:any) => ({
                    ...post,
                    Photo_url:JSON.parse(post.Photo_url),
                    Links: JSON.parse(post.Links),
                    Tags:JSON.parse(post.Tags),
                }));

                setPosts(parsedPosts);
                setIsLoadingPosts(false);
            }catch(error){
                console.log(error);
            }

  
        };
      
        // Call the async function
        fetchData();
        
    }, [setPosts]);

    const handleDelete = async(e:any,id:string) =>{
        e.preventDefault();
        
        //working with the image url of the first imge only
        //since image stored under this folder in AWS
        const len_url=seletedPost.Photo_url[0].split('/').length;
        const folderName=seletedPost.Photo_url[0].split('/')[len_url-2];

        try{
            const res= await fetch(`/api/posts?id=${id}&folderName=${folderName}`,{
                method: "DELETE",
            });

            window.location.reload();

        }catch(error){
            console.log(error);
        }
    };

    const handleDrawer = async(index:number) => {

        setIsOpen(true);
        setSelectedPost(posts[index]);
        console.log(posts[index].downvotes.length);
        setIsLoading(true);
        
        const linksDataPromises = posts[index].Links.map(async (link) => {        
            let data;
            if(link.data[0].product_img){
                data={
                    link:link.value,
                    product_name:link.data[0].product_name,
                    product_img:link.data[0].product_img,
                    product_price:"Price: not available",
                };
            }else{
                data = await handleLinksData(link.value,link);                
            }

            return {
                data
            };
        });
    
        const resolvedLinksData = await Promise.all(linksDataPromises);
        setLinks(resolvedLinksData);
        setIsLoading(false);
    };

    const handleEditPost= () =>{
        if (dialogRef.current) {
            dialogRef.current.showModal();
          }
    };

    const handleLinksData = async(url:string,link:any) =>{
        try {
            const  response  = await fetch(url);
            const data = await response.text();
            const $ = cheerio.load(data);
            
            //page title will be the product name
            const productName = $('title').text().trim().split('|')[0];
            
            //looking for the img tag with alt as the product name 
            let productImg = $('img').filter((index, element) => {
                const alt = $(element).attr('alt');
                return alt && alt.includes(productName.split(" ")[0]);
              }).first();

            //if not found grab the first image from the page
            if (!productImg.length) {
                productImg = $('img').first();
            }
          
            //..
            let productImgUrl = productImg.attr('src').split('//')[1];
            productImgUrl= "https://" + productImgUrl;

            // Extract price from any element whose class contains 'price'
            const productPrice = $('[class*="-price-"]').first().text().trim(); 

            return {
                link:url,
                product_name:productName,
                product_img:productImgUrl,
                product_price:productPrice,
            };

        } catch (error) {
            console.log('Error fetching data');
            return;
        }

    };

    const submitEditedCaption = async(id:number) =>{
        console.log(id);
        const formData = new FormData();
        formData.append("Caption", updateCaption);
        try{
            const res= await fetch(`/api/posts/${id}`,{
                method: "PUT",
                body: formData,
            });
            window.location.reload();

        }catch(error){
            console.log(error);
        }   
    }

    const handleUpvote = async(e:any,postId:string) =>{

        const userId = '66916b730d4aa0106025acd4'; //test user id
    
        try {
            const response = await fetch(`/api/posts/${postId}/upvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
    
            if (!response.ok) {
                console.log('Error downvoting post');
            }
    
            const data = await response.json();
            console.log(data);
    
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleDownvote = async(e:any,postId:string) =>{
        const userId = '66916b730d4aa0106025acd4'; //test user id
    
        try {
            const response = await fetch(`/api/posts/${postId}/downvote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
    
            if (!response.ok) {
                console.log('Error downvoting post');
            }
    
            const data = await response.json();
            console.log(data);
    
        } catch (error) {
            console.error('Error:', error);
        }
    }

    return (
        <>
            <div className="grid grid-cols-4">

                {/*Main feed Posts*/}
                {isLoadingPosts && <LoadingPage/>}
                <div className={`gap-2 p-2 ${isOpen?'col-span-3 columns-3xs': 'col-span-4 columns-3xs'}`}>  {/* col-span-2 for half */}
                    
                    {!isLoadingPosts && posts.map((post:any,index)=>
 
                        <div key={post._id} className="post-card overflow-scroll p-1" >
                            <div>
                                <img src={`${post.Photo_url[0]}`} alt="Photo" className="image"  
                                onClick={()=> handleDrawer(index)}
                                style={{
                                    cursor: "pointer",
                                }}
                                />
                            
                                <span className="post-caption">{post.Caption}</span>
                                
                                <div className="card-actions justify-end">
                                    <span 
                                    className="badge badge-outline badge-primary ">
                                       <button > <BiUpvote className="mr-1" onClick={(e)=> handleUpvote(e,post._id)}/>  </button>
                                       {post.upvotes.length - post.downvotes.length}
                                       <button  onClick={(e)=> handleDownvote(e,post._id)}><BiDownvote className="ml-1" /></button>
                                    </span>
                                    {post.Tags.map((tag:any,i:number)=>
                                        tag.trim() == ""? <span></span>:<span key={`${i}`} className="badge badge-outline text-xs">{tag.trim()}</span>                                      
                                    )}
                                </div>
                            </div>
                        </div>  
                        
                    )}

                </div>  


                {/* Post Drawer */}
                <div className="col-span-2">
                    <div className={`fixed top-0 right-0 w-96 h-full shadow-lg bg-base-100 transition-transform transform  overflow-scroll xl:w-100
                        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                            
                        <div className="p-4">
                            <button className="btn btn-square btn-sm" onClick={()=>{setIsOpen(false)}} >✕</button>
                        </div>

                        {/* inner card */}
                        <div className="p-1">
                            <div className="">

                                <div className="dropdown dropdown-start indicator-item badge">
                                    <div tabIndex={0} role="button" className="">
                                        <SlOptions className="post-ptions" />
                                    </div>

                                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li><button onClick={(e)=> handleDelete(e,seletedPost._id)}>Delete</button></li>
                                        <li><button onClick={handleEditPost}>Edit</button></li>
                                    </ul>
                                </div>

                                {/*Photo*/}
                                {seletedPost.Photo_url &&
                                    <div>
                                        <div className="carousel w-full">
                                            { seletedPost.Photo_url.map((photo:any,i:number)=>
                                                        <div id={`${i+1}`} className="carousel-item relative w-full" key={i}>
                                                            
                                                            <img
                                                                src={`${photo}`}
                                                                className="carousel-image"
                                                                alt="[Photo]" 
                                                            />
                                                            <div 
                                                            className={`absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform 
                                                            justify-between ${seletedPost.Photo_url.length == 1 ? 'hidden':'block'}`}>
                                                                <a href={`#${i}`} className="btn btn-outline btn-circle btn-sm">❮</a>
                                                                <a href={`#${i+1+1}`} className="btn btn-outline btn-circle btn-sm">❯</a>
                                                            </div>
                                                        </div>    
                                                )}
                                        </div>
                                        <div className="flex w-full justify-center gap-2 py-2">
                                                {seletedPost.Photo_url.map((photo:any,i:number)=>
                                                    <a key={i} href={`#${i+1}`} className={`btn btn-xs btn-circle`}>{i+1}</a>
                                                )}
                                        </div>
                                    </div>
                                }   
                            </div>

                            {/* Captions and tags */}
                            <div className="p-1">
                                <span className="post-caption mb-2" onClick={()=>{setDisplayCaption(!displayCaption)}}
                                style={{
                                    WebkitLineClamp: displayCaption ? 'unset' : '2',
                                    cursor: "pointer",
                                }}>
                                    {seletedPost.Caption}
                                </span>

                                {/* tages  */}
                                <div className="card-actions justify-end">
                                {seletedPost.upvotes && <span 
                                    className="badge badge-outline badge-primary ">
                                       <button > <BiUpvote className="mr-1" onClick={(e)=> handleUpvote(e,seletedPost._id)}/>  </button>
                                       {seletedPost.upvotes.length - seletedPost.downvotes.length}
                                       <button  onClick={(e)=> handleDownvote(e,seletedPost._id)}><BiDownvote className="ml-1" /></button>
                                </span>}
                                {seletedPost.Tags && seletedPost.Tags.map((tag:any,i:number)=>
                                        tag.trim() == ""? <span></span>:<span key={i} className="badge badge-outline text-xs">{tag.trim()}</span>                                      
                                    )}
                                </div>
                            </div>

                        </div> 

                        {/* Products */}
                        <div className="grid grid-cols-2">
                            {isLoading && <LoadingPage/>}
                            {!isLoading && links.map((link:any,i) =>
                            
                                <div key={i} className="card card-compact shadow-xl p-2 ">
                                <figure >
                                  <img
                                    src={`${link.data.product_img}`}
                                    alt={`${link.data.product_name}`} />
                                </figure>
                                <div className="card-body ">
                                  <h2 className="card-title text-sm ">{link.data.product_name}</h2>
                                  <p>{link.data.product_price}</p>
                                    <a  className="btn btn-primary btn-sm" href={`${link.data.link}`}>Buy Now</a>
                                </div>
                              </div>
                            )}

                        </div>



                    </div>  
                </div>

                {/* Edit Caption Modal */}
                <dialog id="edit_post" className="modal" ref={dialogRef} >
                    <div className="modal-box w-11/12 max-w-3xl"> 
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        
                        <h3 className="font-bold text-lg">Edit Post</h3>
                        <p className="py-4">Update your Caption on the post:</p>
                        
                        <form action={() => submitEditedCaption(seletedPost._id)} >
                            <input onChange={(e)=> {setUpdateCaption(e.target.value);} } 
                                    type="text" placeholder="Caption" 
                                    className="input input-bordered w-full mb-2" 
                                    id="caption"
                                />    
                            <button 
                                type="submit"
                                className="btn btn-success mt-1">Submit</button>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>                   
                </dialog>
  
            </div>
            
        </>
      
    )
}

export default GetPosts