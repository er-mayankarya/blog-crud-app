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
app.use(cors())
app.use(express.json())


// Routes
app.get('/', (req, res)=> res.send('working'))
app.use('/api/writer', writerRouter)
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
