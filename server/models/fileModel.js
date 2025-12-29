import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "file name is required"],
      trim: true,
      minlength: 2,
    },

    parentDirId: {
      type: Schema.Types.ObjectId,
      required:[true],
      ref: "dir",
       // root directory
      
    },

    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      
    },

    state: {
      type: String,
      enum: ["ACTIVE", "TRASHED", "DELETED"],
      default: "ACTIVE",
     
    },
    isRoot:{
        type:Boolean,
        required:true,
        immutable:true,
        default:false
    },

    trashedAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

export default model("file", fileSchema);
