import { getUsersCollection } from "../config/userCollection.js";
import usersData from "../usersDB.json" with {type:"json"}

export default async function checkAuth(req,res,next){
const {uid}=req.cookies;
console.log(uid);
const userCollection=getUsersCollection(req)
const user=await  userCollection.findOne({id:uid})
console.log("Check Auth users Data:",user);


if(!uid || !user){
   return res.status(401).json({error:"Not logged In / User not Found"})
}else{
   req.user=user
    next()
   } 
}