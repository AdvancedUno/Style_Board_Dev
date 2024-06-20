'use client';
import React, { useState } from "react";
import { useRouter } from 'next/navigation'

const AddPost = () => {
    const router = useRouter()
    //
    const [inputs, setInputs] = useState<string[]>(['']);
    // const [title,setTitle] = useState("");

    const submitData = async(e:any) =>{
        // e.preventDefault();
        console.log("submitted");
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
            <button className="btn btn-primary" onClick={() => add_post.showModal()}>Add Post</button>
            <dialog id="add_post" className="modal">
                <div className="modal-box w-11/12 max-w-3xl">
                    <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    
                    <h3 className="font-bold text-lg">Create Post</h3>
                    <p className="py-4">Please fill the following informations to add your items</p>
                    
                    <form onSubmit={submitData}>
                        <div className="">
                            <input onChange={(e)=> {console.log(e.target.value);} } 
                            type="text" placeholder="Caption" 
                            className="input input-bordered w-full  mb-2" 
                            id="caption" 
                            />     

                            <label className="form-control w-full mb-2">{/*max-w-lg  */}
                                <div className="label">
                                    <span className="label-text">Pick a file:</span>
                                </div>
                                <input type="file" className="file-input file-input-bordered w-full" />
                            </label>

                            <label className="form-control w-full mb-6">{/*max-w-lg  */}
                                <div className="label">
                                    <span className="label-text">Add links to your items: </span>
                                </div>
                                <input onChange={(e)=> {console.log(e.target.value);} } 
                                    type="text" placeholder="Link 1" 
                                    className="input input-bordered w-full  mb-2" 
                                    id="link"/>     
                                
                                <button type="submit" 
                                className="btn btn-primary btn-sm w-full max-w-xs"
                                // onClick={handleAddField}
                                >Add link</button>
                                                 
                            </label>
                            
                            <button type="submit" className="btn btn-success">Submit</button>

                        </div>
                    </form>

                    <div className="modal-action">
                        <form method="dialog" >
                            {/* <!-- if there is a button in form, it will close the modal --> */}
                            {/* <button className="btn btn-success">Submit</button> */}
                        </form>
                    </div>
                        
                </div>
            </dialog>
        </div>
    )
}

export default AddPost