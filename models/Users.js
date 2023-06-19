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
    email:{
        type: String,
        required: true,
        unique:true
    },
    number:{
        type: String,
        unique:true,
        required:true
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


userSchema.statics.login = async function(username, password){
    if(!username || !password){
        throw Error ('All fields are required')
    }
    const user = await this.findOne({username})

    if(!user){
        throw Error('User does not exist')
    }
    const match = await bcrypt.compare(password, user.password)
    if(!match){
        throw Error('Wrong passwor')
    }
    return user
}
module.exports = mongoose.model('User', userSchema)