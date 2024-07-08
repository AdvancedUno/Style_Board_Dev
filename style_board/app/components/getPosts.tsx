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
import { GoDotFill } from "react-icons/go";

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
    }

    const handleDrawer = async(index:number) => {

        setIsOpen(true);
        setSelectedPost(posts[index]);
        setIsLoading(true);
        
        const linksDataPromises = posts[index].Links.map(async (link) => {        
            // console.log(link.data[0]);
            const data = await handleLinksData(link.value,link);
            return {
                data
            };
        });
    
        const resolvedLinksData = await Promise.all(linksDataPromises);
        setLinks(resolvedLinksData);
        setIsLoading(false);
    }

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
            return {
                link:url,
                product_name:link.data[0].product_name,
                product_img:link.data[0].product_img,
                product_price:"",
            };
        }

    }

    return (
        <>
            <div className="grid grid-cols-4">

                {/*Main feed Posts*/}
                {isLoadingPosts && <LoadingPage/>}
                <div className={`gap-2 p-2 ${isOpen?'col-span-3 columns-3xs': 'col-span-4 columns-3xs'}`}>  {/* col-span-2 for half */}
                    
                    {!isLoadingPosts && posts.map((post:any,index)=>
 
                        <div key={post._id} className="post-card overflow-scroll p-1" onClick={()=> handleDrawer(index)}>
                            <div className="">
                                <img src={`${post.Photo_url[0]}`} alt="Photo" className="image" />
                            
                                <span className="post-caption">{post.Caption}</span>
                                <div className="card-actions justify-end">
                                    {post.Tags.map((tag:any )=>
                                        tag.trim() == ""? <span></span>:<span className="badge badge-outline text-xs">{tag.trim()}</span>                                      
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
                                        <li><a>Edit</a></li>
                                    </ul>
                                </div>

                                {/*Photo*/}
                                {seletedPost.Photo_url &&
                                    <>
                                        <div className="carousel w-full">
                                            { seletedPost.Photo_url.map((photo:any,i:number)=>
                                                    <>
                                                        <div id={`${i+1}`} className="carousel-item relative w-full">

                                                            
                                                            <img
                                                                src={`${photo}`}
                                                                className="carousel-image"
                                                                alt="[Photo]" 
                                                            />
                                                            <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                                                                <a href={`#${i}`} className="btn btn-outline btn-circle btn-sm">❮</a>
                                                                <a href={`#${i+1+1}`} className="btn btn-outline btn-circle btn-sm">❯</a>
                                                            </div>
                                                        </div>                                                  
                                                    </>
                                                )}
                                        </div>
                                        <div className="flex w-full justify-center gap-2 py-2">
                                                {seletedPost.Photo_url.map((photo:any,i:number)=>
                                                    <a href={`#${i+1}`} className={`btn btn-xs btn-circle`}>{i+1}</a>
                                                )}
                                        </div>
                                    </>
                                }   
                            </div>

                            {/* Captions and tags */}
                            <div className="p-1">
                                <span className="mb-2" onClick={()=>{setDisplayCaption(true)}}
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: displayCaption ? 'unset' : '2',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    cursor: 'pointer',
                                }}>
                                    {seletedPost.Caption}
                                </span>

                                {/* tages  */}
                                <div className="card-actions justify-end">
                                {seletedPost.Tags && seletedPost.Tags.map((tag:any )=>
                                        tag.trim() == ""? <span></span>:<span className="badge badge-outline text-xs">{tag.trim()}</span>                                      
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
                                    src={`${link.data.product_img ? link.data.product_img :'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXy8vK8vLz19fW5ubm2trbl5eXZ2dni4uLDw8PJycnW1tbr6+vNzc3R0dHp6ene3t6up7FsAAAFqklEQVR4nO2bi5Ksqg6GJUFugrz/254E8NKzp3p6T3fXHHv/X82yFDHwQxJsdU0TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC8C6I/bvtL+/Tt7jOk8ho7Bw93jIqjqd627/Oy7a5lfUl3DL/CzIk1z4+2bQNRscu5yNldlrf1Ff0hY15h5sS/6Fj1Mo/8ReF++FKFpH/UAmP4GB0RSrQX687hhP1oFGwhRd76U5Ut2A6zJ9t6dVdINK4WhdvpofDo0xMK1+DnYIInZ0yYtYU1GjYtQmiJxqQpej0oct5t7ZELlKSgtoLcL6AihsJmvZmRyKIc2tT4ILPmg+GgtikWGgqT1FNDqrDIabXZFS7ZaM+eVWgjZzGcOWfWFldrksus07taOcXBirBFaqRo4zYfhaMpxViNO8PFFbmAUuSYh/FFzfRSvV4k2YmqDc5FCUGJw9gVSnl2Sdsgx8GUZGyirnBlLnKm/F5iV8i8ElURJ1ttJ4uvkHRLot4Y2RUBUhq1lqSGuisM4kPeZr1gprF7eKlmESl1UrCwKJoWFkmB1e2zCtsULqJAG4lN4dTaU3evUlubF/O/T6tjDjMdWxkv77UXVbo962hOTXfvB008JlEEqEe3414mvW8d24zPlZpucc2oikSrpBcdi5ZCD4VVZZAJfThaONam0Ot4U2v6SYWJjm3R7DHXJJE1S1Mt9y/SUuVcnXPVhF1hCy4Z+rk5YZ+0k8LNjO9DJBPSEop3JfJ5DiXYpSxwU9hsal9UYeKibbptVH+v0N0opNlYGyT85u6pXaFj0xmJRPRMQ6F25huFq5gxYkazlPSxzYQMlJVEE88KxQutCanP4dTb6wrL1uaLFU5s5uGlYw61RrXN6YiOMNsUbnOY7Y2XGjMPL22n2vwsNixfvFSGsUy7l7Y5VINtDlt8H22+SuEIPo0z33eTZJp1BENMu5duCpeeYMUYnRbqfoH00rc+16D5s7bppvMcykGr37209mvWEYetsSX+fvH/VqHmHHFVFi/tuVR2NYxGLvXTV4WS7n1Lvq4pHAOuuokkUbfkYQK7tsql5h63CsXwlJtC1vZa6m2GWvNi/plcyt0nbuJQlqsSbLKy1EoHg6xHPNbDcqxNm0LtzWJslFM6k7IIboE6zHDwbVrGgLDUZFlL165QQne2uhBHWZRlDrONLQ91Z5CxlZXapieW/JSkU0mDbUl+35YQisRHnCX1uVzmpQea3LDE4/7Cp26hjlP9dodq3n8upBCymumGx9yqbdlGOVG7EZpjiFVupDLNZXLattRb06pZNocQ52fu206/0U7bHtv6b522NW0vPq49LEznFLTXOcycio9C2o2cy3ZDdKr+Phb9haMh+M5G/hSJk6D3nvWt4/inUI0m5PVzBU7vDwQAAAAAAPBG1vkhlove8dFq+EHC8rO5/0OW7Snfz3C44ixSEoXxIYxh/9fd/QWkD7LpIRKzu+AkNoWP1by6QprW5e7v48srLJbZ3HuGc3GFlFtKvfeY6uIK57Fm3HnUeG2F+7svvvm+hM5Hn6LwnFfbu+7j6NoKt3em509iyLPhQ+K1FU5TV3h+Ba0CzUnixRXqe0W98Tyd8EP0JvHiCidaUozuVO63O/JN4tUVfnnkfwjcJV5f4U2pP/+m6hI/SuGtwCHxMxSG9mb/q8Au8SMUBmb9EugfAkVi/Yjfh0EXjPKdwPa53/UVBu4O+d2Dm49QGO49kvoEhXcFfoLC+wKvr/D4NvJjFX6bXqDwGvxnFJbwA/Xqd20/PtK/+J33Q/2+rMLCnJaHiOaSCqfKj74hNcZe8hUpxYdfkfIz32j/IeTiT4m0E5/5f2d/ymPvR/FpKgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAODz+B9bJTiKWY5GtAAAAABJRU5ErkJggg=='}`}
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
  
            </div>
            
        </>
      
    )
}

export default GetPosts