import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
    name: { type: String, required: false },
    visible: { type: Boolean, required: false },
    type: {
      type: String,
      required: false, // Make it mandatory
    },
  });
const sizesSchema = new mongoose.Schema({
    size: {type:String, required:true},
    price: {type:Number, required:true},
    visible:{type:Boolean}

})


const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description: {type:String, required:true},
    image: {type:Array, required:false},
    attributes: [{type:Array, required:false}],
    category: {type:String, required:true},
    subCategory: {type:String, required:true},
    sizes: [sizesSchema],
    bestseller: {type:Boolean},
    date: {type:Number, required: true}
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel;