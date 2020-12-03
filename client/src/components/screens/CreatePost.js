import React, {useState, useEffect} from 'react'
import M from 'materialize-css'
import {useHistory} from 'react-router-dom'

const CreatePost = ()=>{
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(()=>{
        if(url)
        {
            fetch("/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    img:url
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.error){
                    M.toast({html: data.error, classes:"#b71c1c red darken-4"})
                }
                else{
                    M.toast({html: "Upload Complete!", classes:"#76ff03 light-green accent-4"})
                    history.push('/')
                }
            }).catch(err=>{
                console.log(err)
            })
        }
    }, [url])

    const postDetails = ()=>{
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
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })

        

    }

    return(
        <div className="card input-field"
        style={{
            margin:"10px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}
        >

            <input type="text" 
            placeholder="title"
            value = {title}
            onChange = {(e)=>setTitle(e.target.value)}
            />
            <input type="text" 
            placeholder="body"
            value = {body}
            onChange = {(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
            <div className="btn waves-effect waves-light #e57373 red lighten-2">
                <span>Choose Image</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            <button className="btn waves-effect waves-light #e57373 red lighten-2"
            onClick={()=>postDetails()}
            >
            Create Post
            </button>
        </div>
    )
}

export default CreatePost