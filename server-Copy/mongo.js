import {MongoClient} from "mongoDB"
import filesData from "./filesDB.json" with {type:"json"}
import dirData from "./directoriesDB.json" with {type:"json"}
import usersData from "./usersDB.json" with {type:"json"}
const client=new MongoClient("mongodb://localhost:27017/")
 await client.connect();
 const database=client.db("StorageApp");
 const userCollection=database.collection("users")
 const insertUsers=await userCollection.insertMany(usersData)
 const dirCollection=database.collection("dirs")
 const insertDir=await dirCollection.insertMany(dirData)
  const filesCollection=database.collection("files")
 const insertFiles=await filesCollection.insertMany(filesData)

 console.log(insertUsers,insertFiles,insertDir);
  