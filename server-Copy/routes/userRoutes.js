import express from "express"
import directoriesData from "../directoriesDB.json" with {type:"json"}
import usersData from "../usersDB.json" with {type:"json"}
import {writeFile} from "fs/promises"
const router=express.Router();

console.log("duedueideidei");

router.post("/create-user", async(req,res)=>{
    const UserId=crypto.randomUUID();
    console.log(req.body);
    
    const {username,email,password}=req.body;
    const dirId=crypto.randomUUID();
   if(!username|| !email||!password){
    console.log("Error in UserData");
    
    return res.status(500).res.json({message:"User not created error creating user"})
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

export default router