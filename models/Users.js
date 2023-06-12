const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')
const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    firstname:{
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    confirmPwd:{
        type: String      
    },
    
    email:{
        type: String,
        unique:true
    },
    number:{
        type: Number,
        
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    active:{
        type: Boolean,
        default: true
    }

},{timestamps: true})


userSchema.statics.login = async function(email, password){
    if(!email || !password){
        throw Error ('All fields are required')
    }
    const user = await this.findOne({email})

    if(!user){
        throw Error('Incorrect email')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Wrong passwor')
    }
    return user
}
module.exports = mongoose.model('User', userSchema)