const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    price: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    mrp: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    productDescription: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    productFeatures: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    category: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    subCategory: {
        type: String,
        required: true,
        trim: true,
        maxlength: 25
    },
    images: {
        type: Array,
        required: true
    },
    owner: [{ type: mongoose.Types.ObjectId, ref: "user" }],

    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
    user: {type: mongoose.Types.ObjectId, ref: 'user'}
}, {
    timestamps: true
})

module.exports = mongoose.model('product', productSchema)