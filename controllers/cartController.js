import userModel from "../models/userModel.js"

//add products to user cart
// Example route handler using the authUser middleware
const addToCart = async (req, res) => {
    try {
         // Get the userId from the token (set by authUser middleware)

      const { userId, itemId, size } = req.body;
      console.log(req.body)
      const userData = await userModel.findById(userId);

      // Check if the user exists
      if (!userData) {
        return res.status(404).json({ success: false, message: "User not found" });
      }      
      // Ensure cartData is initialized
      if (!userData.cartData) {
        userData.cartData = {}; // Initialize cartData if it is null or undefined
      }
      
      let cartData = userData.cartData;
  
      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
      await userModel.findByIdAndUpdate(userId, { cartData });
  
      res.json({ success: true, message: "Added to cart" });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
  

//update user cart
const updateCart = async (req, res) => {
    try {
        const {userId, itemId, size, quantity} = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({success: true, message:"Cart updated"})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:error.message})
        
    }
}

//get user cart data
const getUserCart = async (req, res) => {
    try {
      const { userId } = req.body;
  
      const userData = await userModel.findById(userId);
      let cartData = userData.cartData || {}; // Ensure cartData is always an object
  
      res.json({ success: true, cartData });
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: error.message });
    }
  };
export {addToCart, updateCart, getUserCart}
