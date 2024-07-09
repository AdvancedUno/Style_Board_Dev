'use client';
import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation'
import cheerio from 'cheerio';

const AddPost = () => {
    //using ref to handle Modal Add post
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter()
    const linksInputArr = 
        [{
          id: 1,
          value: "",
          data:[{
            id: 0,
            product_name:"",
            product_img: "",
          }],
          showPhotoInput: false
        }];

    //storing links input fields
    const [links, setLinks] = useState(linksInputArr);
    const [caption,setCaption] = useState("");
    const [tags,setTags] = useState([{}]);
    const [photos,setPhotos] = useState([]);

    //Handle Links 
    const handleAddLinks = (e:any) => {
        e.preventDefault();
        setLinks( link => {
          const lastId = link[link.length - 1].id;
          return [
            ...link,
            {
              id: lastId+1,
              value: "",
              data: [{ 
                id: 1,
                product_name:"",
                product_img: "",
            }],
              showPhotoInput: false,
            }
          ];
        });
    };
    const handleRemoveLinks = (e:any,index: number) => {
        e.preventDefault();
        if(links.length == 1 ){
            console.log("need atleat one link");
            alert("Need atleat one link");
            return;
        }  
        const values = [...links];
        values.splice(index, 1);
        setLinks(values);
    };
    const handleLinkChange = (e:any) => {
        e.preventDefault();
        const index = e.target.id;
        checkLink(e.target.value,e,index);
        setLinks(s => {
          const newLink = s.slice();
          newLink[index].value = e.target.value;
          return newLink;
        });        

    };
    const checkLink = async (url:string,e:any,index:number) =>{
        try{
            const response  = await fetch(url);
            if(response.status == 200){
                setLinks(s => {
                    const newLinks = s.slice();
                    newLinks[index].showPhotoInput = false;
                    return newLinks;
                });
            }else{
                setLinks(s => {
                    const newLinks = s.slice();
                    newLinks[index].showPhotoInput = true;
                    return newLinks;
                });
            }
        }catch(error){
            // console.log(error);
            setLinks(s => {
                const newLinks = s.slice();
                newLinks[index].showPhotoInput = true;
                return newLinks;
            });
            return;
        }

    };
    const handleLinkPhotoChange = (e: any, index: number) => {
        setLinks(s => {
            const newLinks = s.slice();
            newLinks[index].data[0].product_img = e.target.value;
            return newLinks;
        });        
    };
    const handleLinkProdNameChange = (e: any, index: number) => {
        setLinks(s => {
            const newLinks = s.slice();
            newLinks[index].data[0].product_name = e.target.value;
            return newLinks;
        });        
    };

    //upload photo
    const handleFileChange= (e:any) =>{
        e.preventDefault();
        const files = e.target.files ? Array.from(e.target.files) : [];
        setPhotos(files);
    
    };

    const handleAddPosts= () =>{
        if (dialogRef.current) {
            dialogRef.current.showModal();
          }
    };

    //submit post form
    const submitData = async() =>{

        const formData = new FormData();
        formData.append("Caption",caption);
        formData.append("Links",JSON.stringify(links));
        formData.append("Tags",JSON.stringify(tags));
        // console.log(JSON.stringify(tags));

        photos.map((each) =>{
            formData.append("Photo",each);         
        })

        
        try{
            const res= await fetch('/api/posts',{
                method: "POST",
                body: formData,
            });
            window.location.reload();
        }catch(error){
            console.log(error);
        }     
        
    };


    return (
        <div>
            {/*  <!-- Open the modal using ID.showModal() method --> */}
            <button className="btn btn-primary" onClick={handleAddPosts}>Add Post</button>


            <dialog id="add_post" className="modal" ref={dialogRef} >
                <div className="modal-box w-11/12 max-w-3xl"> 
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    
                    <h3 className="font-bold text-lg">Create Post</h3>
                    <p className="py-4">Please fill the following informations to add your items</p>
                    
                    <form action={submitData} >

                        {/* add form */}
                        <div className="">
                            <input onChange={(e)=> {setCaption(e.target.value);} } 
                            type="text" placeholder="Caption" 
                            className="input input-bordered w-full  mb-2" 
                            id="caption" 
                            />     

                            <span> Pick a file:</span>
                            <input  onChange={(e) => handleFileChange(e)} 
                                accept="image/*" multiple
                                type="file" 
                                className="file-input file-input-bordered w-full mb-2" 
                                required
                            />

                            {/* Add links */}
                            <div className="mb-2">
                                <span>Add links to your items: </span>
                                {links.map((item,i) => {
                                    return( 
                                        <div key={item.id}>                                
                                            {item.showPhotoInput &&<span className="flex mb-1 text-red-500">Couldn't fetch the data for the link provided. Please Enter detail manually.</span>} 

                                            <div className="flex" >
                                                
                                                <input 
                                                onChange={handleLinkChange}
                                                value={item.value} 
                                                type="text"
                                                placeholder={`Link ${i+1}`} 
                                                className="input input-bordered w-full mb-2" 
                                                id={`${i}`} required />

                                                <button 
                                                    className="btn btn-primary btn-sm ml-2 mt-2"
                                                    onClick={(e) => handleRemoveLinks(e,i)}
                                                    >-</button>
                                                
                                                {item.showPhotoInput &&
                                                <div key={item.data[0].id} className="p-1">
                                                    <span className="m-3">Product Name: </span>
                                                    <input type="text" 
                                                    onChange={(e) => handleLinkProdNameChange(e, i)}
                                                    value={item.data[0].product_name}
                                                    placeholder={`product name ${i+1}`} 
                                                    className="input input-bordered w-50 mb-2" required
                                                    />   

                                                    
                                                    <span className="flex m-3 ">Add Image Address of the product: </span>
                                                    <input type="text" 
                                                        onChange={(e) => handleLinkPhotoChange(e, i)}
                                                        value={item.data[0].product_img}
                                                        placeholder={`product image ${i+1}`} 
                                                        className="input input-bordered w-50 mb-2" required
                                                    /> 
                                                </div>
                                                }                                                    
                                            </div>
                                        </div>
                                    );
                                })}  

   
                                <button 
                                className="btn btn-primary btn-sm w-full max-w-xs"
                                onClick={handleAddLinks}
                                >Add link</button>
                            </div>

                            <span>Add Tags:</span>
                            <input onChange={(e)=> {setTags(e.target.value.split(','));} } 
                                type="text" placeholder="Tags" 
                                className="input input-bordered w-full  mb-2" 
                                id="tags" required
                            />    
                            <span className="flex mb-2 text-slate-400 text-sm">Please add tags in comma seperated form. eg: pants,shorts...</span>   
                                                    
                            <button 
                             type="submit"
                             className="btn btn-success mt-1">Submit</button>

                        </div>

                    </form>
                    
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>                   
            </dialog>
        </div>
    )
}

export default AddPost