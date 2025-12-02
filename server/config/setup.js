import { connectDB } from "./db.js";
const db = await connectDB();
import {client} from "./db.js"

try{
const command='collMod'
 await db.command({
  [command]: "users",
  validator: {
  $jsonSchema: {
    required: [
      "_id",
      "username",
      "email",
      "password",
      "rootDirId",
      "storageUsed",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Unique ObjectId for the user document."

      },
      username: {
        bsonType: "string",
        minLength: 3,
        description: "User's public username. Minimum length 3 characters.",
        minLength:4
      },
      email: {
        bsonType: "string",
        pattern: "^.+@.+\\..+$",
        description: "User's email address. Must match standard email format."
      },
      password: {
        bsonType: "string",
        minLength: 4,
        description: "Hashed password string. Minimum length 4 characters (after hashing it becomes much longer).",
        minLength:4
      },
      rootDirId: {
        bsonType: "objectId",
        description: "The root directory created for this user."
      },
      storageUsed: {
        bsonType: "int",
        description: "Total storage used by the user in bytes."
      },
      createdAt: {
        bsonType: "date",
        description: "Timestamp when the user account was created."
      }
    },
    additionalProperties: false
  }
}
,
  validationLevel:"strict",
validationAction:"error"
});
 await db.command({
  [command]: "files",
  validator: {
  $jsonSchema: {
    required: [
      "_id",
      "name",
      "extension",
      "parentDirId",
      "userId",
      "size",
      "deleted",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Unique ObjectId for the file document."
      },
      name: {
        bsonType: "string",
        description: "File name without extension."
      },
      extension: {
        bsonType: "string",
        description: "File extension such as .jpg, .pdf, .txt."
      },
      parentDirId: {
        bsonType: "objectId",
        description: "Directory ID in which this file is stored."
      },
      userId: {
        bsonType: "objectId",
        description: "The ID of the user who owns this file."
      },
      size: {
        bsonType: "int",
        description: "File size in bytes. Used for storage calculations."
      },
      deleted: {
        bsonType: "bool",
        description: "Soft delete indicator. true = deleted, false = active."
      },
      createdAt: {
        bsonType: "date",
        description: "Timestamp when the file was uploaded."
      }
    },
    additionalProperties: false
  }
}
,
validationLevel:"strict",
validationAction:"error"
});

await db.command({
  [command]: "dirs",
  validator: {
  $jsonSchema: {
    required: [
      "_id",
      "name",
      "parentDirId",
      "userId",
      "deleted",
      "createdAt"
    ],
    properties: {
      _id: {
        bsonType: "objectId",
        description: "Unique ObjectId for the directory document."
      },
      name: {
        bsonType: "string",
        description: "Directory name shown to the user.",
        minLength:4
      },
      parentDirId: {
        bsonType: ["objectId", "null"],
        description: "Parent directory ID. Null means this is the root directory."
      },
      userId: {
        bsonType: "objectId",
        description: "The ID of the user who owns this directory."
      },
      deleted: {
        bsonType: "bool",
        description: "Soft delete flag. true = marked as deleted, false = active."
      },
      createdAt: {
        bsonType: "date",
        description: "Timestamp when this directory was created."
      }
    },
    additionalProperties: false
  }
}
,
validationLevel:"strict",
validationAction:"error"
});

}catch(error){
    console.log("Error While setting up Database",error)
}finally{
client.close();
}