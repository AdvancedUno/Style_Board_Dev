'use client';
import React, { useState, useRef } from "react";
import { useRouter } from 'next/navigation'


const AddPost = () => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const router = useRouter()
    const linksInputArr = 
        [{
          type: "text",
          id: 1,
          value: ""
        }]
    ;

    //storing links input fields
    const [links, setLinks] = useState(linksInputArr);
    const [caption,setCaption] = useState("");
    const [photos,setPhotos] = useState("");

    const handleAddLinks = (e:any) => {
        e.preventDefault();
        setLinks( link => {
          const lastId = link[link.length - 1].id;
          return [
            ...link,
            {
              type: "text",
              id: lastId+1,
              value: ""
            }
          ];
        });
    };
    const handleRemoveLinks = (e:any,index: number) => {
        e.preventDefault();
        if(index == 0 ){
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
        setLinks(s => {
          const newLink = s.slice();
          newLink[index].value = e.target.value;
    
          return newLink;
        });
    };

    //upload photo
    const handleFileChange= (e:any) =>{
        e.preventDefault();

        const file= e.target.files[0];
        setPhotos(file);
    
    };

    const handleAddPosts= () =>{
        if (dialogRef.current) {
            dialogRef.current.showModal();
          }
    }

    const submitData = async(e:any) =>{
        e.preventDefault();
        console.log(links);

        const formData = new FormData();
        formData.append("Caption",caption);
        formData.append("Links",JSON.stringify(links));
        formData.append("Photo",photos);

        try{
            const res= await fetch('http://localhost:3000/api/posts',{
                method: "POST",
                body: formData,
            });

        }catch(error){
            console.log(error);
        }
        window.location.reload();
        
    }


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
                    
                    <form>
                        <div className="">
                            <input onChange={(e)=> {;setCaption(e.target.value);} } 
                            type="text" placeholder="Caption" 
                            className="input input-bordered w-full  mb-2" 
                            id="caption" 
                            />     

                            <label className="form-control w-full mb-2">{/*max-w-lg  */}
                                <div className="label">
                                    <span className="label-text">Pick a file:</span>
                                </div>
                                <input  onChange={(e) => handleFileChange(e)}
                                accept="image/*" //multiple
                                type="file" 
                                className="file-input file-input-bordered w-full mb-2" />
                            </label>
                        
                            <label className="form-control w-full mb-6">
                                <div className="label" >
                                    <span className="label-text">Add links to your items: </span>
                                </div>
                                {links.map((item,i) => {
                                    return(
                                    <div className="flex">
                                        <input key={item.id}
                                        onChange={handleLinkChange}
                                        value={item.value} 
                                        type={item.type}
                                        placeholder={`Link ${i+1}`} 
                                        className="input input-bordered w-full mb-2" 
                                        // id={i}
                                        id={`${i}`}/>   
                                        <button 
                                            className="btn btn-primary btn-sm ml-2 mt-2"
                                            onClick={(e) => handleRemoveLinks(e,i)}
                                            >-</button>
                                    </div>
                                    );
                                })}   
                                <button 
                                className="btn btn-primary btn-sm w-full max-w-xs"
                                onClick={handleAddLinks}
                                >Add link</button>
                                                 
                            </label>
                            
                            <button 
                             onClick={(e) => submitData(e)} 
                             className="btn btn-success">Submit</button>

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