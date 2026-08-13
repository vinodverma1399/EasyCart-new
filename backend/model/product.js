import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {type: String,required: true},
    description: {type: String,required: true},
    price: {type: Number,required: true},
    category: {type: String,required: true},
    imageurl: {type: String,required: true},
    stock: {type: Number,required: true},
    createdAt: {type: Date,default: Date.now},
    reviews: [{
        user: {type: mongoose.Schema.Types.ObjectId,ref: "User"},
        rating: {type: Number,required: true}
    }]
});
const product=mongoose.model("Product", productSchema);
export default product;