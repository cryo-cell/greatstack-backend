import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"; // Import product model if needed

const getAttributeKey = (size, attributesObj) => {
  const entries = Object.entries(attributesObj).sort();
  const attrString = entries.map(([key, value]) => `${key}:${value}`).join("|");
  return `${size}-${attrString}`;
};

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId;

    const {  itemId, size, attributes, price, name, image } = req.body;
    console.log(req.body);

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!userData.cartData) {
      userData.cartData = {};
    }
    let cartData = userData.cartData;

    const parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
    const attributeKey = getAttributeKey(size, parsedAttributes);

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    if (!cartData[itemId][attributeKey]) {
      cartData[itemId][attributeKey] = {
        id: itemId,
        size: size,
        attributes: parsedAttributes,
        quantity: 1,
        price: price,
        name: name,
        image: image,
      };
    } else {
      cartData[itemId][attributeKey].quantity += 1;
    }

    userData.cartData = cartData;
    userData.markModified("cartData");
    await userData.save();

    console.log("Final Cart Data:", cartData);

    res.json({ success: true, message: "Added to cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Update user cart
const updateCart = async (req, res) => {
  try {
    const userId = req.userId;

    const {  itemId, size, attributes, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData || !userData.cartData) {
      return res.status(404).json({ success: false, message: "User not found or no cart data" });
    }

    let cartData = userData.cartData;
    const parsedAttributes = typeof attributes === "string" ? JSON.parse(attributes) : attributes;
    const attributeKey = getAttributeKey(size, parsedAttributes);

    if (cartData[itemId] && cartData[itemId][attributeKey]) {
      if (quantity === 0) {
        // Remove item if quantity is 0
        delete cartData[itemId][attributeKey];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId]; // Remove product entry if empty
        }
      } else {
        cartData[itemId][attributeKey].quantity = quantity;
      }

      userData.cartData = cartData;
      userData.markModified("cartData");
      await userData.save();

      res.json({ success: true, message: "Cart updated", cartData });
    } else {
      res.status(400).json({ success: false, message: "Item not found in cart" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user cart data
const getUserCart = async (req, res) => {
  try {
const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    let cartData = userData.cartData || {};

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear user cart
const clearCart = async (req, res) => {
  try {
    console.log("🟢 clearCart Triggered");
    console.log("Received Body:", req.body);

const userId = req.userId;

    

    const userData = await userModel.findById(userId);
    console.log("User Data Found:", userData);

   

    await userModel.findByIdAndUpdate(userId, { $set: { cartData: {} } });

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("🔴 Error in clearCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart, clearCart };
