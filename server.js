import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import categoryModel from './models/categoryModel.js'
import subCategoryModel from './models/subcategoryModel.js'

import categoryRoutes from './routes/categoryRoute.js'
import subcategoryRoutes from './routes/subcategoryRoute.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express()
const port = process.env.PORT || 4000

connectDB()
connectCloudinary()

// Middleware
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://greatstack-frontend.onrender.com',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}))

// API Endpoints
app.use('/api/category', categoryRoutes)
app.use('/api/subcategory', subcategoryRoutes)
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)

// Log active routes
app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`🟢 Active Route: ${r.route.path}`)
  }
})

// Default route
app.get('/', (req, res) => {
  res.send("API Working")
})

// 🔽 SEED DEFAULT CATEGORIES AND SUBCATEGORIES IF EMPTY
const seedDefaults = async () => {
  const defaultCategories = ['Milk', 'Tea']
  const defaultSubCategories = ['Shirts', 'Hats', 'Mods', 'Salts']

  try {
    const catCount = await categoryModel.countDocuments()
    if (catCount === 0) {
      await categoryModel.insertMany(defaultCategories.map((name) => ({ name })))
      console.log('📦 Default categories loaded')
    }

    const subCatCount = await subCategoryModel.countDocuments()
    if (subCatCount === 0) {
      await subCategoryModel.insertMany(defaultSubCategories.map((name) => ({ name })))
      console.log('📦 Default subcategories loaded')
    }
  } catch (err) {
    console.error('❌ Error loading defaults:', err.message)
  }
}

// Start server after seeding
app.listen(port, async () => {
  await seedDefaults()
  console.log('🚀 Server started on PORT:', port)
})
