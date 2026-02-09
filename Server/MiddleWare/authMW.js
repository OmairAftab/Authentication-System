import jwt from "jsonwebtoken";


//ACTUALLY HUM NE SENDVERIFICATIONOTP AND VERIFYEMAIL WALE JO CONTROLLER MAIN FUNCTIONS BNAEE HAIN UN MAIN HUM NE USERID EXTRACT KRNI HAI WO KAAM KRNE K LIYE BUT USERID DIRECT REQ.BODY SE NHI AAYE GI .. COOKIE K ANDAR TOKEN HAI TOKEN K ANDAR ID HAI JIS KO HUM NE USERID K EQUAL RKHNA HAI ... TO YE KAAM HUM NE IS MIDDLEWARE MAIN KIYA HAI

const authMW =async (req,res, next)=>{

    // console.log("Cookies:", req.cookies);


    //it will find token from the cookie
    const {token} =req.cookies; 

    if(!token){
        return res.status(400).json("Not Authorized. Login again");
    }

    try{

        const decodedtoken= jwt.verify(token, process.env.JWT_SECRET)

        // console.log("Decoded Token:", decodedtoken);
 
        if(decodedtoken.id){
            // Initialize req.body if it's undefined
            if(!req.body){
                req.body = {};
            }

            req.body.userId=decodedtoken.id;

            // console.log("Injected userId:", req.body.userId);
            
            return next();
        }
        else{
            return res.status(400).json("NOT AUTHORIZED. LOGIN AGAIN")
        }

    }
    catch(err){
        console.error("Auth Middleware Error:", err);
        return res.status(401).json({error: "Invalid or expired token", details: err.message});
    }
}



export default authMW;