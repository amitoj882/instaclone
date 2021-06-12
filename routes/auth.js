const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
       api_key:"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"
    }
}))

router.post('/signup', (req,res)=>{
    const {name,email,password,pic} = req.body
    if(!email || !password || !name){
        return res.status(422).json({error:"add all the fields"})
    }
    User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists"})
        }
        bcrypt.hash(password, 12)
        .then(hashedpassword=>{
            const user = new User({
                email, 
                password:hashedpassword,
                name,
                pic
            })
            user.save()
            .then(user=>{
                transporter.sendMail({
                       to:user.email,
                        from:"amitojdimummy@gmail.com",
                       subject:"signup success",
                   html:"<h1>welcome to instagram</h1>"
                     })
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
       
    })
    .catch(err=>{
        console.log(err)
    })
    //console.log(req.body)
})

router.post('/signin', (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"})
    } 
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid email or password"})
        }
        bcrypt.compare(password, savedUser.password)
        .then(doMatch=>{
            if(doMatch){
               // res.join({message:"sign in successfull"})
                const token = jwt.sign({_id:savedUser._id }, JWT_SECRET)
                const {_id,name,email,followers,following,pic} = savedUser
                //const {_id,name,email} = savedUser
                res.json({token,user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalid email or password"})
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

module.exports = router