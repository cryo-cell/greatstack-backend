import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// Function for adding a product
const addProduct = async (req, res) => {
  try {
    const { name, description, attributeGroups, sizes, category, subCategory, bestseller } = req.body;

    const processedSizes = Array.isArray(sizes)
      ? sizes.map((size) => ({ size: size.size, price: size.price }))
      : [];

    const images = [req?.files?.image1?.[0], req?.files?.image2?.[0], req?.files?.image3?.[0], req?.files?.image4?.[0]];
    const imagesUrl = await uploadImages(images);

    const processedAttributeGroups = Array.isArray(attributeGroups)
      ? attributeGroups.map((group) => ({
          name: group.name,
          type: group.type,
          visible: group.visible === "true" || group.visible === true,
          attributes: Array.isArray(group.attributes)
            ? group.attributes.map((attr) => ({ name: attr.name }))
            : [],
        }))
      : [];

    const productData = {
      name,
      description,
      category,
      subCategory,
      sizes: processedSizes,
      attributeGroups: processedAttributeGroups,
      bestseller: bestseller === "true",
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadImages = async (files) => {
  const imagesUrl = [];
  for (const file of files) {
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, { resource_type: "image" });
      imagesUrl.push(result.secure_url);
    }
  }
  return imagesUrl;
};

// Function for listing products
const listProduct = async (req, res) => {
  console.log("Request received for products list");
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for updating a product
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params; // Note: Your route might need to be adjusted to match this
    const { name, description, sizes, category, subCategory, bestseller, attributeGroups } = req.body;

    // Validate required fields
    if (!name || !description || !category || !subCategory) {
      return res.json({ success: false, message: "Required fields are missing." });
    }

    // Process sizes
    const processedSizes = sizes && Array.isArray(sizes)
      ? sizes.map((size) => ({ size: size.size, price: size.price }))
      : [];

    // Process attributeGroups from FormData
    let processedAttributeGroups = [];
    if (attributeGroups && Array.isArray(attributeGroups)) {
      processedAttributeGroups = attributeGroups.map((group) => ({
        name: group.name,
        type: group.type,
        visible: group.visible === "true" || group.visible === true, // Handle string or boolean
        attributes: group.attributes && Array.isArray(group.attributes)
          ? group.attributes.map((attr) => ({ name: attr.name }))
          : [],
      }));
    }

    // Handle images
  // Collect uploaded image files
// Collect uploaded image files
const imageFiles = [req?.files?.image1?.[0], req?.files?.image2?.[0], req?.files?.image3?.[0], req?.files?.image4?.[0]];
const uploadedUrls = await uploadImages(imageFiles);

// Collect image URLs from form body (e.g. image1Url, image2Url...)
const urlImages = [];
for (let i = 1; i <= 4; i++) {
  const url = req.body[`image${i}Url`];
  if (url) urlImages.push(url);
}

// Combine both uploaded and URL-based images
const imagesUrl = [...uploadedUrls, ...urlImages];

// Collect image URLs from form body (e.g. image1Url, image2Url...

// Combine both uploaded and URL-based images


    // Prepare data to update
    const updatedProductData = {
      name,
      description,
      category,
      subCategory,
      sizes: processedSizes,
      attributeGroups: processedAttributeGroups,
      bestseller: bestseller === "true",
      date: Date.now(),
    };
    if (imagesUrl.length) {
      updatedProductData.image = imagesUrl; // Only update images if new ones are provided
    }

    // Find and update the product
    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updatedProductData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found!" });
    }

    res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.json({ success: false, message: error.message });
  }
};

// Function for removing a product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, updateProduct, listProduct, removeProduct, singleProduct };