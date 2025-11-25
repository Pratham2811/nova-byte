import express from "express"
import checkAuth from "../middlewares/authMiddleware.js";
import { getUsersCollection } from "../config/userCollection.js";
import { getDirsCollection } from "../config/dirCollection.js";
import { normalizeDoc } from "../utils/apiDataFormat.js";
import { ObjectId } from "mongodb";
import { transactionProvide } from "../utils/transaction.js";
const router=express.Router();



router.post("/create-user", async(req,res)=>{
const body = req.body || {};
const { username, email, password } = body;
console.log();

if(!username|| !email||!password){
    console.log("Error in UserData");
    return res.status(400).json({message:"User not created. Error: Missing data."})
   }
try{ 
  await transactionProvide(async (session)=>{
const userCollection=getUsersCollection(req)
const dirsCollection=getDirsCollection(req)

   
   //find if email is exists in DB
const RedundantEmail= await userCollection.findOne({email:email})
   
if(RedundantEmail){
    return res.status(409).json({message:"User Already Registered with Same email"})
   }
const userId=new ObjectId();
const rootDirId=new ObjectId();
   
const dirData={
    _id:rootDirId,
    name:`root-${email}`,
    parentDirId:null,
    userId:userId,
    deleted:false,
   
    createdAt: new Date()
  }



   const  userData={
    _id:userId,
    username,
    email,
    password,
    rootDirId:rootDirId,
    storageUsed:0,
    createdAt: new Date()
    }
    
  
     const dirInsertion= await dirsCollection.insertOne(dirData,{session});
    const userInsertion= await userCollection.insertOne(userData,{session})
   
  
 


res.status(201).json({message:"User created Sucessfully"})
  })
   }catch(error){
    if(error.code==121){
         res.status(400).json({
      status: "error",
      message: "Invalid input,Please Enter valid Detail ",
    });
    }else{
      console.log(error);
      
      res.status(500).json({
      status: "error",
      message: "Error Creating User",
    });
    }
   }
})


router.post("/login-user", async (req,res)=>{
const body = req.body || {};
const { email, password } = body;
console.log(email,password);

try{
const userCollection=getUsersCollection(req)
const findUser=await userCollection.findOne({email:email},{
  projection:
  {
    
    email:1,
    password:1,
    
  }
})
console.log("Data from Db:",findUser);

if(!findUser){

    console.log("Login Failed: Email not found.");
    return res.status(404).json({message:"Network ID not recognized. User not found."})
    }
    
   
if(findUser.password !== password){  
    console.log("Login Failed: Password mismatch.");
    return res.status(401).json
      ({
        status:"error",message:"Access Key Invalid. Authentication failed."
      })
    }

const user=normalizeDoc(findUser);


res.cookie("uid",`${user.id}`,{
    httpOnly:true,
    secure:true,
    sameSite:"none"

    })

return res.status(200).json(
  {
  status:"success",
  message:`Access granted for user. Welcome to the Drive.`,
  }
)
}catch(error){
  res.status(500).json({
    status:"error",
    message:"Internal server Error"
  })
}
})

router.post("/logout-user",(req,res)=>{
    // res.cookie("uid","",{
    //     maxAge:0,
    // })
    res.clearCookie("uid")
    res.status(204).end();
})

router.get("/",checkAuth,async (req,res,next)=>{
  
   const userCollection=getUsersCollection(req,res)

 
  
 try{
  const userData = await userCollection.findOne(
  { name: req.user.name },
  { projection: { name: 1, email: 1, _id: 0 } }
);



 if(!userData){
  return res.status(404).json({ status: "error", message: "User not found" });
 }
  res.status(200).json({
    status:"success",
      data: {
    username: userData.name,
    useremail: userData.email,
  },
    
  })
}catch(error){
  return res.status(500).json({ status: "error", message: "Internal server error" });
}
   
})
export default router
