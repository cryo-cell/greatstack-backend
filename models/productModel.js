import mongoose from "mongoose";

// Schema for individual attributes within a group
const attributeSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: "20mg", "Banana Milkshake"
});

// Schema for size and price options
const sizesSchema = new mongoose.Schema({
  size: { type: String, required: true },         // Example: "Small", "500mL", etc.
  price: { type: Number, required: true },
  visible: { type: Boolean, default: true },
});

// Schema for attribute groups (e.g., "Nicotine", "Flavor")
const attributeGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },         // Example: "Nic", "Flavor"
  type: { type: String, required: true },         // "radio", "checkbox", etc.
  visible: { type: Boolean, default: true },      // Hide/show this group on frontend
  attributes: [attributeSchema],                  // Array of possible values
});

// Main product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: [{ type: String }],
  attributeGroups: [attributeGroupSchema],        // 💡 Use attributeGroups instead of flat attributes
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  sizes: [sizesSchema],
  bestseller: { type: Boolean, default: false },
date: { type: Number, required: false, default: () => Date.now() }
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);
export default productModel;
