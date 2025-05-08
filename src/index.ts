import express from 'express';
import connectDB from './config/connectDb';
import userRouter from './routes/UserRoutes';
// import AdminRoutes from './routes/AdminRoutes'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
dotenv.config()
const app = express();
const port =process.env.PORT ;

connectDB()



// app.use("/uploads", express.static(path.resolve("uploads")));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))

// app.use('/api/admin',AdminRoutes)
app.use('/api/users',userRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
