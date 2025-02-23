import productModel from "../models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

// Function for adding a product
const addProduct = async (req, res) => {
  try {
    const { name, description, attributeGroups, sizes, category, subCategory, bestseller } = req.body;

    let processedSizes = [];
    if (sizes && Array.isArray(sizes)) {
      processedSizes = sizes.map((size) => ({
        size: size.size,
        price: size.price,
      }));
    }

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4];
    let imagesUrl = [];
    for (let i = 0; i < images.length; i++) {
      if (images[i]) {
        let result = await cloudinary.uploader.upload(images[i].path, { resource_type: "image" });
        imagesUrl.push(result.secure_url);
      }
    }
   let processedAG = attributeGroups.map((attributeGroups,attributeGroupsIndex)=>({
      name: attributeGroups.name,


    }))
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
    const productData = {
      name,
      description,
      category,
      subCategory,
      sizes: processedSizes,
      attributeGroups: processedAttributeGroups, // Remove undefined entries
      bestseller: bestseller === "true",
      image: imagesUrl,
      date: Date.now(),
    };
    console.log("Product Data to Save:", productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
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
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const images = [image1, image2, image3, image4];
    let imagesUrl = [];
    if (images.some((image) => image !== undefined)) {
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          try {
            let result = await cloudinary.uploader.upload(images[i].path, { resource_type: "image" });
            imagesUrl.push(result.secure_url);
          } catch (uploadError) {
            console.error(`Error uploading image ${i + 1}:`, uploadError);
          }
        }
      }
    }

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