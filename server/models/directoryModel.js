import { Schema, model } from "mongoose";

const directorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Dir",
      default: null, 
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      
    },

    state: {
      type: String,
      enum: ["ACTIVE", "TRASHED", "DELETED"],
      default: "ACTIVE",
      index: true,
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

export const directoryModel=model("Dir",directorySchema)