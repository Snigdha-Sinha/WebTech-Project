import React, {useState,useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = ()=>{

    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [image,setImage] = useState("")
    const [url,setUrl] = useState(undefined)

    useEffect(()=>{
        if(url){
            uploadFields()
        }
    },[url])
    const uploadPic = ()=>{
        
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
    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#b71c1c red darken-4"})
            }
            else{
                M.toast({html: data.message, classes:"#76ff03 light-green accent-4"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err)
        })

    }
    const PostData = ()=>{
        if(image){
            uploadPic()
        }else{
            uploadFields()
        }
        
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
            <h3>Sign-up</h3>
            <input
            type = "text"
            placeholder="Name"
            value = {name}
            onChange = {(e)=>setName(e.target.value)}
            />
            <input
            type = "text"
            placeholder="email"
            value = {email}
            onChange = {(e)=>setEmail(e.target.value)}
            />
            <input
            type = "password"
            placeholder="password"
            value = {password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <div className="file-field input-field">
            <div className="btn waves-effect waves-light #e57373 red lighten-2">
                <span>Upload Picture</span>
                <input type="file" onChange={(e)=>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text"/>
            </div>
            </div>
            <button className="btn waves-effect waves-light #e57373 red lighten-2"
            onClick={()=>PostData()}>
            Sign up
            </button>
            <h6>
                <Link to="./signin">Account already exists?</Link>
            </h6>
            </div>
        </div>
    )
}

export default Signup