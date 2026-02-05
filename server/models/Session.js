import { Schema, model } from "mongoose";

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
      immutable: true,
    },

    state: {
      type: String,
      enum: ["ACTIVE", "DELETED", "SUSPENDED"],
      default: "ACTIVE",
    },
    createdAt:{
        type:   Date,
        default:Date.now,
        expires:3600*24,
    }
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

const Session = model("Session", sessionSchema);
export default Session; 
