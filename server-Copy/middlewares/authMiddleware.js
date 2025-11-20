import { getUsersCollection } from "../config/userCollection.js";
export default async function checkAuth(req,res,next){
const {uid}=req.cookies;
console.log(uid);
const userCollection=getUsersCollection(req)
const user=await  userCollection.findOne({id:uid})



if(!uid || !user){
   return res.status(401).json({error:"Not logged In / User not Found"})
}else{
   req.user=user
    next()
   } 
}