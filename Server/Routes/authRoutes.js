import express from 'express';
import {register, login, logout, sendVerifyOtp, verifyemail, isAuthenticated, sendResetOTP, resetPassword} from '../Controllers/authController.js'
import authMW from "../MiddleWare/authMW.js";

const router=express.Router();



router.post('/register', register)

router.post('/login',login)

router.post('/logout',logout)

router.post('/send-verify-otp', authMW , sendVerifyOtp)

router.post('/verify-account', authMW, verifyemail)

// router.post('/is-authenticated', authMW, isAuthenticated)
router.get('/is-authenticated', authMW, isAuthenticated)

router.post('/send-reset-otp', sendResetOTP)

// public endpoint for resetting password (no auth required)
router.post('/reset-password', resetPassword)



export default router;











