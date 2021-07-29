const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    username: {
        type: String,
        required: true,
        unique: true,
        default: mongoose.Types.ObjectId,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        
        unique: true
    },
    password: {
        type: String,
        required: true
       
    },
    avatar:{
        type: String,
        default:"https://res.cloudinary.com/ayshubham/image/upload/v1625903953/instagram-default-profile-picture-11562973083brycehrmyv_lhoclt.png"
    },
    role: {type: String, default: "user"},
    gender: {type: String, default: "male"},
    mobile: {type: String, default: ""},
    address: {type: String, default: ""},
       followers: [{type: mongoose.Types.ObjectId, ref: 'user'}],
       following: [{type: mongoose.Types.ObjectId, ref: 'user'}],

    isAdmin: { type: Boolean, required: true, default: false },
    isSeller: { type: Boolean, required: true, default: false },
    seller: {
         name: String,
         logo: String,
         description: String,
         rating: { type: Number, default: 0 },
         numReviews: { type: Number, default: 0 },
      
   
    
       }
    
},{
    timestamps: true

})

module.exports = mongoose.model('user', userSchema)