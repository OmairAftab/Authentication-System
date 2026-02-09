import mongoose from 'mongoose';

//desine the mongodb connection url
const mongoURL='mongodb://localhost:27017/mern-auth'; //local url
// const mongoURL='mongodb+srv://Mohammad Omair Aftab:Mong00000@cluster0.i9g2cgl.mongodb.net/'; //online mongodbatlas se connect hua ye.  AIK TIME PE AIK E CHALE GA

//  YE CODE main is k andar b kuch cheezen likhi th but in new version they arenot required
mongoose.connect(mongoURL);



const db=mongoose.connection;


// event listners for db connection:
db.on('connected',()=>{console.log("  Connected to mongodb Server ")})

db.on('disconnected',()=>{console.log("  Disconnected fom mongodb database ")})

db.on('error',(err)=>{console.log("  Error :  ", err)})



// jo db ka connection kiya hai us ko export kr lo ta k server wali file main use kr sken
export default db;

 






