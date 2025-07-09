import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.js";
import 'dotenv/config';
import userRouter from "./routes/userRoute.js";
import sellerRouter from "./routes/sellerRoute.js";
import connectCloudinary from "./configs/cloudinary.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import addressRouter from "./routes/addressRoute.js";
import orderRouter from "./routes/orderRoute.js";
import { stripeWebhooks } from "./controllers/orderController.js";

const app = express();
const port = process.env.PORT || 5000;

// ✅ Set up middleware BEFORE routes
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://greencart-new.vercel.app'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// ✅ For Stripe raw body, isolate it below
app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhooks);

// ✅ Connect DB and Cloudinary
await connectDB();
await connectCloudinary();

// ✅ Routes
app.get('/', (req, res) => res.send("API is working"));
app.use('/api/user', userRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
  console.log(`server is running on http://localhost:${port}`);
});
