import { model, Schema } from "mongoose";

const AuthProviderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      required: true,
      enum: ["password", "google","github"],
      index: true,
    },

    // For password provider
    passwordHash: {
      type: String,
      default: null,
    },

    // For OAuth providers like Google
    providerUserId: {
      type: String,
      default: null,
    },

    providerEmail: {
      type: String,
    },
  },
  { timeseries: true },
);

export const AuthProvider = model("AuthProviders", AuthProviderSchema);
