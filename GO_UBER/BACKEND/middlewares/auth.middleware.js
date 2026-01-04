const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1]
    
    if(!token){
        return res.status(401).json({errors: [{msg: 'No token, authorization denied'}]});
    }

    const isBlacklisted = await blacklistTokenModel.findOne({token});
    if(isBlacklisted){
        return res.status(401).json({errors: [{msg: 'Token is blacklisted, authorization denied'}]});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id).select('-password');
        if(!user){
            return res.status(401).json({errors: [{msg: 'User not found, authorization denied'}]});
        }       
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({errors: [{msg: 'Unauthorized, token is not valid'}]});
    }


}
