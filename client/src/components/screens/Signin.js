import React, {useState, useContext, useCallback} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {UserContext} from '../../App'
import M from 'materialize-css'

const Signin = ()=>{
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    
    const PostData = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#b71c1c red darken-4"})
            return
        }
        fetch("/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
            if(data.error){
                M.toast({html: data.error, classes:"#b71c1c red darken-4"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "Sign-in Succesful!",classes:"#76ff03 light-green accent-4"})
                history.push('/')
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return(
        <div className="mycard">
            <div className="card auth-card input-field">
            <h3>Sign-in</h3>
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
            <button className="btn waves-effect waves-light #e57373 red lighten-2"
            onClick={()=>PostData()}
            >
            Login
            </button>
            <h6>
                <Link to="./signup">Do not have an account?</Link>
            </h6>
            </div>
        </div>
    )
}

export default Signin