const User = require('../models/Users')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')


const createToken = (_id) =>{
   return jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3d'})
}

// Login users
const loginUser = async(req, res) =>{
    const {username, password} = req.body

    try{
        const user = await User.login(username, password)

        const token = createToken(user._id)

        res.status(200).json({username, token, user})
    }catch(error){
        res.status(400).json({error:error.message})
    }
}
//Find user
const getAllUser = async(req, res) =>{
    try{
        const user = await User.find()
        if(user){
            res.status(200).json(user)
        }
    }catch(error){
        res.status(400).json({error:"No user found"})
    }
}
const getUser = async(req, res)=>{
    const id = req.params.id
    try{
        const user = await User.findById(id)
        if(user){
            const {password, ...otherDetails} = user._doc
            res.status(200).json(otherDetails)
        }
    }catch(err){
        res.status(500).json(err)
    }
}

//Register new user
const registerUser = async(req, res) =>{
    const {username, password, firstname, confirmPwd,lastname, email, number } = req.body
    
    let emptyFields = []

    if(!username){
        emptyFields.push('username')
    }
    if(!firstname){
        emptyFields.push('firstname')
    }
    if(!lastname){
        emptyFields.push('lastname')
    }
    if(!password){
        emptyFields.push('password')
    }
    if(!confirmPwd){
        emptyFields.push('confirmPwd')
    }
    if(!email){
        emptyFields.push('email')
    }
    if(!number){
        emptyFields.push('number')
    }
    if(emptyFields.length > 0){
       return res.status(400).json({error: 'Please fill all fields', emptyFields})
    }

    if(password !== confirmPwd){
        return res.status(400).json({error:'Password and Confirm password must match'})
         
     }
     if(!validator.isEmail(email)){
         return res.status(400).json({error:'Email is not valid'})
             
     }
    
    const userExist = await User.findOne({username}).lean().exec()
    const mailExist = await User.findOne({email}).lean().exec()
    
    if(userExist){
        return res.status(409).json({error:"Username exist"})
    }
    if(mailExist){
        return res.status(409).json({error:"Mail exist"})
    }
        const hashedPwd = await bcrypt.hash(password, 10)
        const newUser = new User({username, "password":hashedPwd, firstname, lastname, email, number})
        try{
            await newUser.save()
            //Create token
            const token = createToken(newUser._id)
            res.status(200).json({username, token})

        }catch(error){
            res.status(500).json({error:error.message})
        }
    
}
const updateUser = async(req, res) =>{
    const {id} =req.params
    const {currentUserId, currentUserAdminStatus, password} = req.body
    if(id === currentUserId || currentUserAdminStatus){
        try{
            if(password){
                req.body.password = await bcrypt.hash(password, 10)
            }
            const user = await User.findByIdAndUpdate(id, req.body, {new: true})
            res.status(200).json(user)
        }catch(error){
            res.status(500).json({error:"Something wrong"})
        }
       
    }else{
        return res.status(403).json({error:'Can only update your profile'})
    }

}
//Delete User
const deleteUser = async(req, res)=>{
    const id = req.params.id
    const {currentUserId, currentUserAdminStatus} = req.body
    if(id === currentUserId || currentUserAdminStatus){
        try{
            const user = await User.findByIdAndDelete(id)
            res.status(200).json({error:'User deleted'})
        }
        catch(error){
            res.status(500).json({error:"Something went wrong"})
        }
    }else{
        res.status(409).json({error:'Action forbbiden'})
    }
}


module.exports ={
    getAllUser,
    registerUser,
    updateUser,
    getUser,
    deleteUser,
    loginUser
}