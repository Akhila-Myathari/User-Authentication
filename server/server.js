import express from 'express'
import dotenv from 'dotenv'
dotenv.config();
import cookieParser from 'cookie-parser';
import cors from 'cors';
import  dbConnect  from './dbConfig/dbConnection.js';
import router from './routes/authRoutes.js';
import router2 from './routes/userRoutes.js';
const app = express();

const PORT = process.env.PORT

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173',credentials:true}))
app.use('/api/auth',router);
app.use('/api/user',router2);
app.get('/',(req,res)=>{
    res.send("HELLO");
})


app.listen(PORT,()=>{
    console.log("server running on the port 5000");
    dbConnect();
})
