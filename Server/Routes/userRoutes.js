import express from 'express';
import authMW from "../MiddleWare/authMW.js";
import getUserData from '../Controllers/userController.js';

const router=express.Router();


router.get('/data', authMW, getUserData )



export default router;