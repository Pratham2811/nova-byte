import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      minlength: 2,
      maxlength: 60,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 16,
      trim: true,
    },

    rootDirId: {
      type: Schema.Types.ObjectId,
      ref: "Directory",
      required: true,
      immutable: true,
    },

    storage: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    state: {
      type: String,
      enum: ["ACTIVE", "DELETED", "DISABLED", "SUSPENDED"],
      default: "ACTIVE",
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

const User = model("User", UserSchema);
export default User;
