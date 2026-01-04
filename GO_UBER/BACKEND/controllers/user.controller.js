const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const {validationResult} =  require('express-validator');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.registerUser = async (req, res,next) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {fullname: {firstname, lastname}, email, password} = req.body;

    const hashedPassword = await userModel.prototype.hashPassword(password);

    const user = await userService.createUser({firstname, lastname, email, password: hashedPassword});

    const token = user.generateAuthToken(); 
    
    res.status(201).json({user, token});

}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req);   
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;

    const user = await userModel.findOne({email}).select('+password');

    if(!user){
        return res.status(401).json({errors: [{msg: 'Invalid email or password'}]});
    }

    const isMatch = await userModel.prototype.comparePassword(password, user.password);

    if(!isMatch){
        return res.status(401).json({errors: [{msg: 'Invalid email or password'}]});
    }

    const token = user.generateAuthToken();

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({user, token});
}

module.exports.getUserProfile = async (req, res, next) => {

    res.status(200).json({user: req.user});
}

module.exports.logoutUser = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(' ')[1]
    res.clearCookie('token');
    
    if(!token){
        return res.status(401).json({errors: [{msg: 'No token, authorization denied'}]});
    }

    const blacklisted = await blacklistTokenModel.create({token});

    res.status(200).json({message: 'Logged out successfully'});
}
