import express from "express"
import checkAuth from "../middlewares/authMiddleware.js";
import { getUsersCollection } from "../config/userCollection.js";
import { getDirsCollection } from "../config/dirCollection.js";
const router=express.Router();



router.post("/create-user", async(req,res)=>{
const body = req.body || {};
const { username, email, password } = body;
if(!username|| !email||!password){
    console.log("Error in UserData");
    return res.status(400).json({message:"User not created. Error: Missing data."})
   }
try{ 
const userCollection=getUsersCollection(req)
const dirsCollection=getDirsCollection(req)
const UserId=crypto.randomUUID();
const dirId=crypto.randomUUID();
   
   //find if email is exists in DB
const RedundantEmail= await userCollection.findOne({email:email})
   
if(RedundantEmail){
    return res.status(409).json({message:"User Already Registered with Same email"})
   }
    
const dirData={
    id:dirId,
    name:`root-${email}`,
    parentDir:null,
    files:[],
    directories:[],
    userId:UserId,
    deleted:false
  }
const dirInsertion= await dirsCollection.insertOne(dirData);
const  userData={
    id:UserId,
    name:username,
    email,
    password,
    rootDirId:dirId
    }
const userInsertion= await userCollection.insertOne(userData)
res.status(201).json({message:"User created Sucessfully"})
   }catch(error){
    res.status(500).json({message:"Internal server Error"})
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
    id:1,
    email:1,
    password:1,
    _id:0
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

console.log("User Found and Authenticated.");
res.cookie("uid",`${findUser.id}`,{
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
