import express from "express"
import directoriesData from "../directoriesDB.json" with {type:"json"}
import usersData from "../usersDB.json" with {type:"json"}

const router=express.Router();

console.log("duedueideidei");

router.post("/create-user", async(req,res)=>{
    const UserId=crypto.randomUUID();
    const {name,email,password}=req.body.userData;
    const dirId=crypto.randomUUID();

     console.log(name,email,password);
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
        name,
        email,
        password,
        rootDirId:dirId
 
    })
        
    await 
    res.status(201).json({message:"User created Sucessfully"})
})

export default router