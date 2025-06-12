import express from 'express';
import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
  updateProduct
} from '../controllers/productController.js';
import upload from '../middleware/multer.js';
import adminAuth from '../middleware/adminAuth.js';
import Product from '../models/productModel.js'; // You need to import this

const productRouter = express.Router();

productRouter.post(
  '/add',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  addProduct
);

productRouter.post('/remove', adminAuth, removeProduct);
productRouter.get('/single/:productId', adminAuth, singleProduct);
productRouter.get('/list', listProduct);

productRouter.put(
  '/update/:productId',
  adminAuth,
  upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 },
  ]),
  updateProduct
);

// ✅ Bulk add route (add Product import above!)
productRouter.post('/bulk', async (req, res) => {
  try {
    const products = req.body;

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products provided' });
    }

    const created = await Product.insertMany(products);
    res.json({ success: true, count: created.length, products: created });
  } catch (error) {
    console.error('Bulk upload error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
productRouter.delete("/all", async (req, res) => {
  try {
    await Product.deleteMany({});
    res.json({ success: true, message: "All products deleted." });
  } catch (error) {
    console.error("Error deleting all products:", error);
    res.status(500).json({ success: false, message: "Failed to delete all products." });
  }
});

export default productRouter;
