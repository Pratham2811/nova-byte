import express from "express"
import directoriesData from "../directoriesDB.json" with {type:"json"}
import usersData from "../usersDB.json" with {type:"json"}
import {writeFile} from "fs/promises"
import checkAuth from "../middlewares/authMiddleware.js";
const router=express.Router();



router.post("/create-user", async(req,res)=>{
    const UserId=crypto.randomUUID();
   
    const {username,email,password}=req.body;
    const dirId=crypto.randomUUID();
   if(!username|| !email||!password){
    console.log("Error in UserData");
    
    // Correcting response structure for error during user creation
    return res.status(500).json({message:"User not created. Error: Missing data."})
   }
    const RedundantEmail=usersData.find((user)=> user.email===email)
    if(RedundantEmail){
        return res.status(409).json({message:"User Already Registered with Same email"})
    }
      directoriesData.push({
        id:dirId,
        name:`root-${email}`,
        parentDir:null,
        files:[],
        directories:[],
        userId:UserId,
        deleted:false
      })
    usersData.push({
        id:UserId,
        name:username,
        email,
        password,
        rootDirId:dirId
    })
        
   try{ await writeFile("./directoriesDB.json",JSON.stringify(directoriesData));
    await writeFile("./usersDB.json",JSON.stringify(usersData));
    res.status(201).json({message:"User created Sucessfully"})
   }catch(error){
    res.status(500).json({message:"Internal server Error"})
   }
})


router.post("/login-user",(req,res)=>{

  console.log("hiiii");
  
    const{email,password}=req.body;

    
    const foundUser=usersData.find((user)=>{
        return user.email===email
    })
    
    if(!foundUser){

        console.log("Login Failed: Email not found.");
        return res.status(404).json({message:"Network ID not recognized. User not found."})
    }
    
   
    if(foundUser.password !== password){
      
        console.log("Login Failed: Password mismatch.");
        return res.status(401).json({message:"Access Key Invalid. Authentication failed."})
    }
    

    
    console.log("User Found and Authenticated.");
  
    
    res.cookie("uid",`${foundUser.id}`,{
        httpOnly:true,
        secure:true,
        sameSite:"none"

    })
   
    return res.status(200).json({message:`Access granted for user ${foundUser.name}. Welcome to the Drive.`,
  
    })
})
router.post("/logout-user",(req,res)=>{
    // res.cookie("uid","",{
    //     maxAge:0,
    // })
    res.clearCookie("uid")
    res.status(204).end();
})
router.get("/",checkAuth,(req,res,next)=>{
  res.status(200).json({
    username:req.user.name,
    email:req.user.email
  })
   
})
export default router
