import productModel from "../models/productModel.js"
import {v2 as cloudinary} from 'cloudinary'
//function for add procuct
const addProduct = async (req, res) => {
  try {
    const { name, description, attributeGroups, attributes, sizes, category, subCategory, bestseller } = req.body;
   // console.log(req.body.attributeGroups);  // Check if attributes is a string

    //console.log(req.body);  // Check what is inside sizes

    let processedSizes = [];
    if (sizes && Array.isArray(sizes)) {
      processedSizes = sizes.map(size => ({
        size: size.size,
        price: size.price,
      }));
    }
    let processedAtty = [];
    if (attributes && Array.isArray(attributes)) {
      processedAtty = attributes.map(att => ({
        name: att.name,
        type: att.type,
      }));
      console.log(processedAtty)
    }
    const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        //console.log( name, description, attributes, category, subCategory, bestseller );
    const images = [image1, image2, image3,image4];
    let imagesUrl =[]
    for(let i=0; i <images.length; i++){
      if(images[i]){
      let result = await cloudinary.uploader.upload(images[i].path, { resource_type: 'image' });
      imagesUrl.push(result.secure_url);
      }
        }
    // Handle attributesGroups properly (might need JSON parsing)
    //const attributeGroups = req.body.attributeGroups;
        const atty = attributeGroups.map((item)=>{
          
          return item.attributes
        })
        console.log(atty);

    // Process each attribute group and attribute as needed...
    // Your existing logic for sizes and images should be fine

    const productData = {
      name,
      description,
      category,
      subCategory,
      sizes: processedSizes, // Sizes are already properly formatted
      attributes: atty,
      bestseller: bestseller === "true",
      image: imagesUrl, // Handle images as before
      date: Date.now(),
    };

    // Save the product
    const product = new productModel(productData);
   // console.log(product);
    await product.save();

    res.json({ success: true, message: "Product added successfully!" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


//function for list product
const listProduct = async (req, res) => {
    console.log("Request received for products list");  // Check if the request is being made
    try {
        const products = await productModel.find({});
        res.json({ success: true, products });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Add the update product function
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, description, attributeGroups, attributes, sizes, category, subCategory, bestseller } = req.body;

    // Validate required fields
    if (!name || !description || !category || !subCategory) {
      return res.json({ success: false, message: "Required fields are missing." });
    }

    // Process sizes
    const processedSizes = sizes && Array.isArray(sizes)
      ? sizes.map(size => ({ size: size.size, price: size.price }))
      : [];

    // Process attributes
    const processedAtty = attributes && Array.isArray(attributes)
      ? attributes.map(att => ({ name: att.name, type: att.type }))
      : [];

    // Handle images - Check if new images are provided, else retain old images
    const images = [
      req.files.image1 && req.files.image1[0],
      req.files.image2 && req.files.image2[0],
      req.files.image3 && req.files.image3[0],
      req.files.image4 && req.files.image4[0]
    ];

    let imagesUrl = [];
    if (images.some(image => image !== undefined)) {
      for (let i = 0; i < images.length; i++) {
        if (images[i]) {
          try {
            let result = await cloudinary.uploader.upload(images[i].path, { resource_type: 'image' });
            imagesUrl.push(result.secure_url);
          } catch (uploadError) {
            console.error(`Error uploading image ${i + 1}: `, uploadError);
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
      attributes: processedAtty,
      bestseller: bestseller === "true",
      image: imagesUrl.length ? imagesUrl : undefined, // Only update images if new ones are provided
      date: Date.now(),
    };

    // Find product by ID and update it
    const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedProductData, { new: true });

    if (!updatedProduct) {
      return res.json({ success: false, message: "Product not found!" });
    }

    res.json({ success: true, message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


//function for remove procuct
const removeProduct = async (req, res) =>{
    try {
        await productModel.findByIdAndDelete(req.body.id)
        res.json({succes:true, message:"product removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})   
    }

}

//function for singe procuct info
const singleProduct = async (req, res) =>{
    try {
        const {productId} = req.params
        const product = await productModel.findById(productId)
        res.json({success:true,product})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})   
        
    }
}

export{addProduct, updateProduct, listProduct, removeProduct, singleProduct}