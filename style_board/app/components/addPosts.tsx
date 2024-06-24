'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation'

const AddPost = () => {
    const router = useRouter()
    const linksInputArr = [
        {
          type: "text",
          id: 1,
          value: ""
        }
    ];

    //storing links input fields
    const [links, setLinks] = useState(linksInputArr);
    const [caption,setCaption] = useState("");
    const [photos,setPhotos] = useState("");

    const handleAddLinks = () => {
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
    const handleRemoveLinks = (index: number) => {
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


    const handleFileChange= (e:any) =>{
        e.preventDefault();

        const file= e.target.files[0];
        setPhotos(file);

        // if(!file.type.startsWith('image/')){
        //     alert("Upload Image!!");
        //     return;
        // };

    
    };

    const submitData = async(e:any) =>{
        e.preventDefault();
        console.log("submitted here");
        console.log(links);
        console.log(caption);
        console.log(photos);

        const formData = new FormData();
        formData.append("Caption",caption);
        // formData.append("Links",links);
        formData.append("Photo",photos);

        // try{

        // }catch{

        // }
        

        // router.refresh();
    //     try{
    //         const res= await fetch('http://localhost:3000/api/cart',{
    //             method: "POST",
    //             headers: {
    //                 "Content-type": "application/json",
    //             },
    //             body: JSON.stringify({title}),
    //         });
    //     }catch(error){
    //         console.log("error: ");
    //         console.log(error);
    //     }

    }


    return (
        <div>
            {/* <input onChange={(e)=> {console.log(e.target.value);setTitle(e.target.value);} } type="text" placeholder="data" classNameName="input input-bordered w-full max-w-xs" id="data"/> */}
            {/* <button className="btn btn-primary" onClick={()=> console.log("added")}> {/*onClick={submitData}>*/}
                {/* Add Post
            </button> */}
            
            {/*  <!-- Open the modal using ID.showModal() method --> */}
            <button className="btn btn-primary" onClick={()=> document.getElementById('add_post').showModal()}>Add Post</button>
            <dialog id="add_post" className="modal">
                <div className="modal-box w-11/12 max-w-3xl"> 
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    
                    <h3 className="font-bold text-lg">Create Post</h3>
                    <p className="py-4">Please fill the following informations to add your items</p>
                    
                    {/* <form onSubmit={submitData}> */}
                        <div className="">
                            <input onChange={(e)=> {console.log(e.target.value);setCaption(e.target.value);} } 
                            type="text" placeholder="Caption" 
                            className="input input-bordered w-full  mb-2" 
                            id="caption" 
                            />     

                            <label className="form-control w-full mb-2">{/*max-w-lg  */}
                                <div className="label" key="1">
                                    <span className="label-text">Pick a file:</span>
                                </div>
                                <input  onChange={(e) => handleFileChange(e)}
                                accept="image/*" //multiple
                                type="file" 
                                className="file-input file-input-bordered w-full mb-2" />
                            </label>
                        
                            <label className="form-control w-full mb-6">
                                <div className="label" key="2">
                                    <span className="label-text">Add links to your items: </span>
                                </div>
                                {links.map((item,i) => {
                                    return(
                                    <div className="flex">
                                        <input key={i}
                                        onChange={handleLinkChange}
                                        value={item.value} 
                                        type={item.type}
                                        placeholder={`Link ${i+1}`} 
                                        className="input input-bordered w-full mb-2" 
                                        // id={i}
                                        id={`${i}`}/>   
                                        <button 
                                            className="btn btn-primary btn-sm ml-2 mt-2"
                                            onClick={() => handleRemoveLinks(i)}
                                            >-</button>
                                    </div>
                                    );
                                })}   
                                <button 
                                className="btn btn-primary btn-sm w-full max-w-xs"
                                onClick={handleAddLinks}
                                >Add link</button>
                                                 
                            </label>
                            
                            <button onClick={submitData} className="btn btn-success">Submit</button>

                        </div>
  
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>                   
            </dialog>
        </div>
    )
}

export default AddPost