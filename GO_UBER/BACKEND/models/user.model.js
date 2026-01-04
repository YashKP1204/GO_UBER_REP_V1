const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, "Full name must be at least 3 characters long"],
    },
    lastname: {
      type: String,
        minlength: [3, "Last name must be at least 3 characters long"],
    },
  },
  email: {
    type: String,
    required: true,
    minlength: [5, "Email must be at least 5 characters long"],
  },
  password: {
    type: String,
    required: true,
    selected:false
  },
  socketId: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = function(){
const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
return token; 
}     
userSchema.methods.comparePassword = async function(password, hashedPassword){
    return await bcrypt.compare(password, hashedPassword);
}  

userSchema.methods.hashPassword = async function(password){
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const User = mongoose.model('User', userSchema);

module.exports = User;

