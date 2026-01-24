import { Schema, model } from "mongoose";

const fileSchema = new Schema(
  {
    
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },

   
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },

    
    storagePath: {
      type: String,
      required: true,
    },

    extension: {
      type: String,
      required: true,
      lowercase: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
      min: 0,
    },

    parentDirId: {
      type: Schema.Types.ObjectId,
      ref: "Dir",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
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
    timestamps: true,
    strict: "throw",
  }
);

export default model("File", fileSchema);
