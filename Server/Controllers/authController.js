import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import UserModel from '../Models/userModels.js'
import transporter from "../Config/nodemailer.js";




//FUNCTION FOR USER REGISTRATION
const register=async(req,res)=>{
    const {name,email,password} =req.body;

    if(!name || !email || !password){
        return res.status(400).json({success: false, message: "Required Details are missing"})
    }


    try{

        //check of yser already exist
        const existingUser=await UserModel.findOne({email});
        if(existingUser){
            return res.status(400).json({success: false, message: "User already exists"})
        }

        const hashedpassword= await bcrypt.hash(password, 5);

        const user=new UserModel({name,email, password: hashedpassword})

        await user.save();


        //generate token
        const token=jwt.sign({id: user._id} , process.env.JWT_SECRET , {expiresIn: '7d'}) ///user.id jo bnti hai db main like ._id
        

        //now we have to send this token to user in res and  we will send by cookie
        res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production', //hum ne env main NODE_ENV ko =local host rkha hai .. to is line ka mtlb ye hai k secure tb hoga jb node_env production k equal ho and localhost pe secure ni hoga
            sameSite : process.env.NODE_ENV === 'production' ? 'none': 'strict', //samesite will be strict in local host as both the forntend and backend eill run on the same server . but in the case of production we wont be hosting frontend and backend on same place so in that case the samesite will be none
            maxAge: 7*24*60*60*100 //7 days written in milliseconds
        
        })


        //SEND REGRATION EMAIL
        const mailOptions={
            from: `"Omair's Tech Solutions" <mohammadomair4519@gmail.com>`,
            to: email, //this email jo hum ne request body se li hai
            subject: "Welcome to Omair's Authentication System",
            text:`Welcome to Omair's Authentication system. Your account has been verified with email ${email}`
        }

        await transporter.sendMail(mailOptions);


        return res.status(200).json({success: true, message: "User Registered successfully"})
  
  
    }
    catch(err){
        res.json({success: false, message: err.message || "An error occurred"})
    }
}







//FUNCTIOn FOR LOGIN OF USERS
const login= async (req,res)=>{
    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({success: false, message: "Both email and password are required"});
    }


    try{

        const user =await UserModel.findOne({email});

        if(!user){
            return res.status(404).json({success: false, message: "Invalid email. User doesn't exist"});
        }

        const isMatch=await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({success: false, message: "Invalid password"})
        }


        //yahan agar cide pohancha mean user exist and password is correct and now we will generate token and using it user will be authenticated and logged in website
        const token=jwt.sign({id: user._id} , process.env.JWT_SECRET , {expiresIn: '7d'}) ///user.id jo bnti hai db main like ._id
        

        //now we have to send this token to user in res and  we will send bby cookie
        res.cookie('token', token, {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production', //hum ne env main NODE_ENV ko =local host rkha hai .. to is line k amtlb ye hai k secure tb hoga jb node_env production k equal ho and localhost pe secure ni hoga
            sameSite : process.env.NODE_ENV === 'production' ? 'none': 'strict', //samesite will be strict in local host as both the forntend and backend eill run on the same server . but in the case of production we wont be hosting frontend and backend on same place so in that case the samesite will be none
            maxAge: 7*24*60*60*100 //7 days written in milliseconds
        
        })


        return res.status(200).json({success: true, message: "User logged in successfully"})



    }catch(err){
        res.json(err)
       
    }
}








//FUNSTION FOR LOGOUT
const logout=(req,res)=>{

    try{

        //JUST CLEAR THE COOKIE
         res.clearCookie('token', {
            httpOnly:true,
            secure: process.env.NODE_ENV === 'production', //hum ne env main NODE_ENV ko =local host rkha hai .. to is line k amtlb ye hai k secure tb hoga jb node_env production k equal ho and localhost pe secure ni hoga
            sameSite : process.env.NODE_ENV === 'production' ? 'none': 'strict', //samesite will be strict in local host as both the forntend and backend eill run on the same server . but in the case of production we wont be hosting frontend and backend on same place so in that case the samesite will be none
            maxAge: 7*24*60*60*100 //7 days written in milliseconds
        })

        return res.status(200).json({success: true, message: "Logged out successfully"});

    }catch(err){
        return res.json({success: false, message: err.message || "Logout error"});
    }
}







//function that send verification otp to 
const sendVerifyOtp= async (req,res)=>{

    try{

        const {userId} =req.body;

        if(!userId){
            return res.status(400).json({success: false, message: 'Missing userId in request'});
        }

        const user=await UserModel.findById(userId);
        
        if(!user){
           return res.status(404).json({success: false, message: 'User not found'});
        }

        if(user.isVerified){ //user is already verified
            return res.status(409).json({success: false, message: 'User is already verified'})
        }

        //generate a random 6 digit otp
        const otp= String(Math.floor(100000+Math.random()*900000));

        //user k model main hum ne verifyotp wala aik diya hua us ko update kro
        user.verifyOtp= otp;

        user.verifyOtpExpireAt=Date.now() + 5*60*1000; //5 minute in ms

        //user will be saved with updated verifyOtp and verifyOtpExpireAt fields. 
        await user.save();


        //now send verification otp email to user 
        const mailOptions={
            from: `"Omair's Tech Solutions" <${process.env.SENDER_EMAIL}>`,
            to: user.email, 
            subject: "Account Verification OTP",
            text:`Your OTP is ${otp}. Verify your account using this OTP`
        }

        try{
            const info = await transporter.sendMail(mailOptions);
            console.log('OTP email sent:', info.response || info.messageId || info);
            return res.status(200).json({success: true, message: `Verification OTP sent on Email ${user.email}. The OTP is valid only for 1 minute`});
        }catch(mailErr){
            console.error('Error sending OTP email:', mailErr);
            return res.status(502).json({success: false, message: 'Failed to send email'});
        }

    }
    catch(err){

        console.log("SEND OTP ERROR:", err);
       return res.status(500).json({success: false, message: err.message || "Error sending OTP"});

    }

}






 
//function so we can verify the otp received in email
const verifyemail= async (req,res)=>{
    const {userId,otp} =req.body;

    if(!userId || !otp){
        return res.status(400).json({success: false, message: "Missing details"})
    }

    try{

        const user= await UserModel.findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        //at this point user exist, otp is correct . Now checking that if otp is still usable
        if(user.verifyOtpExpireAt < Date.now()){
            return res.status(400).json({success: false, message: "OTP EXPIRED"})
        }


        //NOW AT THIS POINT USER EXIST, OTP IS CORRECT AND IS NOT EXPIRED
        user.isVerified=true;

        //reset values of verifyotp and verifyotpexpireat
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save(); //update user


        return res.status(200).json({success: true, message: 'Email Verified Successfully'})

    }
    catch(err){
        return res.status(500).json({success: false, message: err.message || "Error verifying email"})

    }
}








//CHECK IF USER IS AUTHENTICATED
const isAuthenticated = (req,res)=>{
    //hum route bnate hue beech main authMW use kren ge so agar cookie main token available hua mean ser is authenticated
    //AS WE R USING MIDDLEWARE BETWEEN WHEN MAKING ITS ROUTE. The middleware already validated the token, so if we reach here, user is authenticated
    return res.status(200).json({success: true, message: "User is Authenticated"})
}










//FUNCTION TO SEND OTP to RESET his PASSWORD 
const sendResetOTP = async (req,res)=>{

    const {email} =req.body;

    if(!email){
        return res.status(400).json({success: false, message: "Email is Required"})
    }


    try{

        const user=await UserModel.findOne({email});

        if(!user){
            return res.status(400).json("User not found");
        }

         //generate a random 6 digit otp
        const otp= String(Math.floor(100000+Math.random()*900000));

        //user k model main hum ne verifyotp wala aik diya hua us ko update kro
        user.resetOtp= otp;

        user.resetOtpExpireAt=Date.now() + 2*60*1000; //2 minute in ms

        //user will be saved with updated verifyOtp and verifyOtpExpireAt fields. 
        await user.save();


        //now send otp to user for resetting its password
        const mailOptions={
            from: `"Omair's Tech Solutions" <${process.env.SENDER_EMAIL}>`,
            to: user.email, 
            subject: "PASSWORD RESET OTP",
            text:`Your OTP is ${otp}. Use this OTP to proceed with resetting your password`
        }

        try{
            await transporter.sendMail(mailOptions);
            return res.status(200).json({success: true, message: `PASSWORD RESET OTP sent on Email ${user.email}. The OTP is valid only for 2 minutes`});
        }catch(mailErr){
            console.error('Error sending OTP email:', mailErr);
            return res.status(502).json({success: false, message: 'Failed to send email'});
        }


    }
    catch(error){
        return res.status(400).json({success: false, message: "Error occurred while sending reset OTP"});

    }
}








//FUNCTION TO VERIFY OTP AND RESET PASSWORD
const resetPassword= async (req,res)=>{

    const {email, otp , newPassword} =req.body;

    if(!email || !otp || !newPassword){
        return  res.status(400).json({success: false, message: "EMAIL, PASSWORD AND OTP ARE REQUIRED"})
    }


    try{

        const user=await UserModel.findOne({email});

        if(!user){
            return res.status(400).json("User not found");
        }
 
        if(user.resetOtp==='' || user.resetOtp!==otp){       //user.resetOTP wo hai jo store db main jb hum otp mngvane k liye is se upar wala function call kren ge ... and ye jo sirf otp likha hai ye is request k doran user de ga
             return res.status(400).json({success: false, message: "Invalid OTP"})
        }

        //at this point user exist, otp is correct . Now checking that if otp is still usable
        if(user.resetOtpExpireAt < Date.now()){
            return res.status(400).json({success: false, message: "OTP EXPIRED"})
        }


        //hash the passsword that user gave
        const hashedpassword=await bcrypt.hash(newPassword,5);

        //update user passwod with new hashed password
        user.password=hashedpassword;


        user.resetOtp="";
        user.resetOtpExpireAt=0;

        await user.save();

        return res.status(200).json({success: true, message: "Password updated successfully"});
    }
    catch(err){
        return res.status(500).json({success: false, message: err.message || "Error resetting password"});       
    }
}




export {
    register,
    login,
    logout,
    sendVerifyOtp,
    verifyemail,
    isAuthenticated,
    sendResetOTP,
    resetPassword
}
