import React, {useEffect, useState, useContext, useCallback} from 'react'
import {UserContext} from '../../App'

const Profile = ()=>{
    const [mypics,setPics] = useState([])
    const {state, dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    const [url,setUrl] = useState("")

    useEffect(()=>{
        fetch('/mypost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            setPics(result.mypost)
        })
    },[])
    useEffect(()=>{
        if(image){
            const data = new FormData()
            data.append("file", image)
            data.append("upload_preset", "img-cloud")//this is the name of our upload preset on cloudinary
            data.append("cloud_name", "insta-clone-cloud")
            fetch("https://api.cloudinary.com/v1_1/insta-clone-cloud/image/upload",{
                method:"post",
                body:data
            })
            .then(res=>res.json())
            .then(data=>{
                
               // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                //dispatch({type:"UPDATEPIC",payload:data.url})
                fetch('/updatepic',{
                    method:"put",
                    headers:{
                        "Content-Type":"application/json",
                        "Authorization":"Bearer "+localStorage.getItem("jwt")
                    },
                    body:JSON.stringify({
                        pic:data.url
                    })
                
                }).then(res=>res.json())
                .then(data=>{
                    setUrl(data.url)
                    console.log(data)
                    localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
                    dispatch({type:"UPDATEPIC",payload:data.url})
                })
               
            })
            .catch(err=>{
                console.log(err)
            })
        }
    },[image])
    const updatePhoto = (file)=>{
        setImage(file)
    }
    return(
        <div style={{maxWidth:"550px",margin:"0px auto"}}>
        <div >
        
     
            <div style={{
                display:"flex",
                justifyContent:"space-around",
                margin:"18px 0px",
                borderBottom:"1px solid grey"
            }}>
                <div>
                    <img style = {{width:"160px",height:"160px",borderRadius:"80px"}}
                    src={state?state.pic:"loading"}/>

                </div>
                <div>
                    <h4>{state?state.name:"loading"}</h4>
                    <h5>{state?state.email:"loading"}</h5>
                    <div style={{display:"flex",
                    justifyContent:"space-between",
                    width:"108%",
                    }}>
                        <h6>{mypics.length} posts</h6>
                        <h6>{state?state.followers.length:"0"} followers</h6>
                        <h6>{state?state.following.length:"0"} following</h6>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="gallery">
                {
                    mypics.map(item=>{
                        return(
                            <img key={item._id} className="item" src={item.photo} alt={item.title}/>
                        )
                    })
                }
            </div>
        
        
        </div>
    )
}

export default Profile