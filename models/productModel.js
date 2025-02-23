import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Only name for attributes
});

const sizesSchema = new mongoose.Schema({
  size: { type: String, required: true },
  price: { type: Number, required: true },
  visible: { type: Boolean },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: [{ type: String }],
  attributeGroups: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true }, // e.g., "radio" or "checkbox"
      visible: { type: Boolean, default: true },
      attributes: [attributeSchema],
    },
  ],
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: [sizesSchema],
  bestseller: { type: Boolean, default: false },
  date: { type: Number, required: true },
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;