import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

//
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()
//MIDDLEWARES
app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],  // Allow requests from your frontend
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,                // Allow cookies or auth headers if needed
}));
//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


app._router.stack.forEach((r) => {
  if (r.route && r.route.path) {
    console.log(`🟢 Active Route: ${r.route.path}`);
  }
});
app.get('/', (req, res)=>{
    res.send("API Working")
})

app.listen(port, ()=>{
    console.log('Server started on PORT: ' + port)
})