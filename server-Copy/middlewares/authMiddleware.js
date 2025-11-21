import { ObjectId } from "mongodb";
import { getUsersCollection } from "../config/userCollection.js";
import { normalizeDoc } from "../utils/apiDataFormat.js";
export default async function checkAuth(req,res,next){
const {uid}=req.cookies;

const userCollection=getUsersCollection(req)
const user=normalizeDoc(await  userCollection.findOne({_id:new ObjectId(uid)}))





if(!uid || !user){
   return res.status(401).json({error:"Not logged In / User not Found"})
}else{
   req.user=user
    next()
   } 
}