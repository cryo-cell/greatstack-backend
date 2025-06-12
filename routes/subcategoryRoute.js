// routes/subCategoryRouter.js
import express from 'express'
import subCategoryModel from '../models/subcategoryModel.js'
import adminAuth from '../middleware/adminAuth.js'

const subcategoryRouter = express.Router()

// Get all subcategories
subcategoryRouter.get('/', async (req, res) => {
  try {
    const subcategories = await subCategoryModel.find({})
    res.json(subcategories)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Add new subcategory
subcategoryRouter.post('/', adminAuth, async (req, res) => {
  const { name } = req.body
  if (!name) return res.status(400).json({ message: 'Subcategory name required' })

  try {
    const exists = await subCategoryModel.findOne({ name })
    if (exists) return res.status(400).json({ message: 'Subcategory already exists' })

    const subcategory = new subCategoryModel({ name })
    await subcategory.save()
    res.status(201).json(subcategory)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Delete subcategory
subcategoryRouter.delete('/:name', adminAuth, async (req, res) => {
  try {
    const deleted = await subCategoryModel.findOneAndDelete({ name: req.params.name })
    if (!deleted) return res.status(404).json({ message: 'Subcategory not found' })
    res.json({ message: 'Subcategory deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default subcategoryRouter
