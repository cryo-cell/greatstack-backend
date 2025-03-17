import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js"; // Import product model if needed

// Add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, attributes, price, name, image } = req.body;
    console.log(req.body);

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Ensure cartData is initialized
    if (!userData.cartData) {
      userData.cartData = {};
    }
    let cartData = userData.cartData;

    // Generate a unique key combining size and attributes
    const attributeKey = `${size}-${JSON.stringify(attributes)}`;

    if (!cartData[itemId]) {
      cartData[itemId] = {}; // Initialize item in cartData
    }

    if (!cartData[itemId][attributeKey]) {
      // If item with size and attributes does not exist, create it
      cartData[itemId][attributeKey] = {
        id: itemId,
        size: size,
        attributes: attributes,
        quantity: 1,
        price: price,
        name: name,
        image: image,
      };
    } else {
      // If item exists, increase the quantity
      cartData[itemId][attributeKey].quantity += 1;
    }

    await userModel.findByIdAndUpdate(userId, { $set: { cartData } });
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
    const { userId, itemId, size, attributes, quantity } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData || !userData.cartData) {
      return res.status(404).json({ success: false, message: "User not found or no cart data" });
    }

    let cartData = userData.cartData;
    const attributeKey = `${size}-${JSON.stringify(attributes)}`;

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

      await userModel.findByIdAndUpdate(userId, { cartData });

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
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
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

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: "Missing userId" });
    }

    const userData = await userModel.findById(userId);
    console.log("User Data Found:", userData);

    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    await userModel.findByIdAndUpdate(userId, { $set: { cartData: {} } });

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("🔴 Error in clearCart:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export { addToCart, updateCart, getUserCart, clearCart };
