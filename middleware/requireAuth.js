const jwt = require('jsonwebtoken')
const User = require('../models/Users')
const requireAuth = async(req, res, next) =>{
    const { authorization } = req.headers

    if(!authorization){
        return res.status(404).json({error: 'Authorization required'})
    }
    const token = authorization.split(' ')[1]

    try{
        const {_id} = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.user = await User.findOne({_id}).select('_id')
        
        next()
    }catch(error){
        console.log(error)
        res.status(401).json({error: 'Request not autorized'})
    }
}
module.exports = requireAuth