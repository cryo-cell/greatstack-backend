// routes/categoryRouter.js
import express from 'express'
import categoryModel from '../models/categoryModel.js'
import adminAuth from '../middleware/adminAuth.js'

const categoryRouter = express.Router()

// Get all categories
categoryRouter.get('/', async (req, res) => {
  try {
    const categories = await categoryModel.find({})
    res.json(categories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add new category
categoryRouter.post('/', async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ message: 'Category name required' });

  try {
    const exists = await categoryModel.findOne({ name });
    if (exists) return res.status(400).json({ message: 'Category already exists' });

    const category = new categoryModel({ name }); // 👈 Do NOT include subCategories at all
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Delete category
categoryRouter.delete('/:name',  async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name).trim();
    const deleted = await categoryModel.findOneAndDelete({ name: new RegExp(`^${name}$`, 'i') });

    if (!deleted) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default categoryRouter
