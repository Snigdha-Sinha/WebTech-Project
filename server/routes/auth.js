const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')
const requireLogin = require('../middleware/requireLogin')



router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        return res.status(422).json({ error: "Please fill in all the fields." })
            //the status code 200 means the request has succeeded, but since there is an error, 
            //we change the status code to 422 to indicate unprocessable entity error
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "This email already exists." })
            }
            bcrypt.hash(password, 12)
                .then(hashedpassword => {
                    const user = new User({
                        email,
                        password: hashedpassword,
                        name
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: "Saved Successfully" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })

        })
        .catch(err => {
            console.log(err)
        })

})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter email id or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid email id or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: "Successfully signed in!" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const {_id, name, email} = savedUser
                        res.json({ token, user:{_id, name, email} })
                    } else {
                        return res.status(422).json({ error: "Invalid email id or password" })
                    }
                })
                .catch(err => {
                    console.log(err) //error from developer's side
                })
        })
})

module.exports = router