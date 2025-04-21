const mongoose =  require('mongoose');
const { request } = require('../app');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be 3 character long'],
        },
        lastname:{
            type:String,
            minlength:[3,'Lastname must be 3 char long'],
        },

    },
    email:{
        type:String,
        required:true,
        minlength:[5,'must be 5 char long'],
    },
    password:{
        type:String,
        required:true,
        select:false,
    }, 

    socketId:{
        type:String,
    },
})


userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id}, process.env.JWT_SECRET,{expiresIn:'1d'});
    return token;
}

userSchema.methods.comparePassword = async function (password)  {
    return await bcrypt.compare(password,this.password);
}

userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password,10);
}


const userModel = mongoose.model('user',userSchema);

module.exports=userModel;