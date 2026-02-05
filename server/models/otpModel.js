import { Schema, model } from "mongoose";

const OtpSchema = new Schema(
  {
    otp:{
        type:String,
        required:true,
        trim:true,
    },
    email: {
      type: String,
      required: true,
      immutable: true,
    },
    createdAt:{
        type:   Date,
        default:Date.now,
        expires:900,
    }
  },
  {
    strict: "throw",
    timestamps: true,
  }
);

const Otp = model("Otp", OtpSchema);
export default Otp; 
