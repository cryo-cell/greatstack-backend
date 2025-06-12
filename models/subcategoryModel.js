import mongoose from 'mongoose'

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
})

const subCategoryModel = mongoose.models.SubCategory || mongoose.model('SubCategory', subCategorySchema)

export default subCategoryModel

export { subCategorySchema }  // Export schema if you want to use it elsewhere
