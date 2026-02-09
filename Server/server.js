import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import db from './Config/db.js'; //jo db.js se export kraya tha 



const app=express();

const port=process.env.PORT || 4000;



app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true, origin: process.env.FRONTEND_URL || 'http://localhost:5173'}));


app.get('/',(req,res)=>{
    res.send("LETS DO MERN AUTH")
})


//JO ROUTES AUTHROUTES MAIN BNAE HAIN WO YAHAN IMPORT KRO
import authRoutes from './Routes/authRoutes.js';
// use these authentication routes
app.use('/api/auth',  authRoutes);



//USE USER ROUTES
import userRoutes from './Routes/userRoutes.js';
app.use('/api/user', userRoutes)


app.listen(port,()=>{console.log("Server Started")})
