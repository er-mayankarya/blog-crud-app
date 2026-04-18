import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connect } from 'mongoose';
import connectDB from './configs/db.js';
import writerRouter from './routes/writerRoutes.js';
import blogRouter from './routes/blogRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

await connectDB()


// Middleware
app.use(cors({
  origin: "*"
}));
app.use(express.json())


// Routes
app.get('/', (req, res)=> res.send('working'))
app.use('/api/writer', writerRouter)
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running");
})

export default app;
