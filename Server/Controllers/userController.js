import UserModel from '../Models/userModels.js'


const getUserData= async (req,res)=>{

    try{

        const {userId} =req.body;

        const user= await UserModel.findById(userId);

        if(!user){
            return res.status(404).json({success: false, message: "User not found"});
        }

        return res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                isAccountVerified: user.isVerified
            }
        })
    }
    catch(err){
        return res.status(400).json({success:false, message : err.message})
    }
}



export default getUserData;