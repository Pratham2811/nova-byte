import { Schema, model } from "mongoose";

const directorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Directory name is required"],
      trim: true,
      minlength: 2,
    },

    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "dir",
      default: null, // root directory
      
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

export default model("dir", directorySchema);
