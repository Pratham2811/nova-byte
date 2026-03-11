import mongoose, { Schema } from "mongoose";

const IntegratedAppSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: ["google-drive", "github"],
      required: true,
    },

    providerAccountId: {
      type: String,
      required: true,
    },

    email: {
      type: String,
    },

    accessToken: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
    },

    tokenExpiry: {
      type: Date,
    },

    scope: {
      type: String,
    },

    status: {
      type: String,
      enum: ["connected", "revoked", "sync"],
      default: "connected",
    },
  },
  {
    timestamps: true,
  },
);

IntegratedAppSchema.index(
  {
    userId: 1,
    provider: 1,
    providerAccountId: 1,
  },
  { unique: true },
);

export default mongoose.model("IntegratedApp", IntegratedAppSchema);
