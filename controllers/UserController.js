const User = require('../models/Users')
const bcrypt = require('bcrypt')
const validator = require('validator')
const jwt = require('jsonwebtoken')


const createToken = (_id) =>{
   return jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3d'})
}
//Find user
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
    const {username, password, firstname, confirmPwd,lastname, email } = req.body
    if(password !== confirmPwd){
        return res.status(400).json({msg:"Password does not match"})
    }
    if(!validator.isEmail(email)){
        return res.status(500).json({msg:"Email not valid"})
    }
    if(!validator.isStrongPassword(password)){
        return res.status(500).json({msg:"password not strong enough"})
    }
    const userExist = await User.findOne({username}).lean().exec()
    const mailExist = await User.findOne({email}).lean().exec()
    
    if(userExist){
        return res.status(409).json({msg:"Username exist"})
    }
    if(mailExist){
        return res.status(409).json({msg:"Mail exist"})
    }
        const hashedPwd = await bcrypt.hash(password, 10)
        const newUser = new User({username, "password":hashedPwd, firstname, lastname, email})
        try{
            await newUser.save()
            //Create token
            const token = createToken(newUser._id)
            res.status(200).json({username, token})

        }catch(error){
            res.status(500).json({msg:error.message})
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
        return res.status(403).json({msg:'Can only update your profile'})
    }

}
//Delete User
const deleteUser = async(req, res)=>{
    const id = req.params.id
    const {currentUserId, currentUserAdminStatus} = req.body
    if(id === currentUserId || currentUserAdminStatus){
        try{
            const user = await User.findByIdAndDelete(id)
            res.status(200).json({msg:'User deleted'})
        }
        catch(err){
            res.status(500).json({msg:"Something went wrong"})
        }
    }else{
        res.status(409).json({msg:'Action forbbiden'})
    }
}


module.exports ={
    registerUser,
    updateUser,
    getUser,
    deleteUser
}