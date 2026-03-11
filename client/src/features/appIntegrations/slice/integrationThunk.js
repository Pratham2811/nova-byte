import api from "@/shared/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const connectGoogleDrive = createAsyncThunk(
  "integrations/googleDrive",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/integrations/google-drive/connect");
      return res.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || "Something went Wrong",
      );
    }
  },
);
export const getIntegrationsInfo = createAsyncThunk(
  "integrations/info",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/integrations/all");
      return res.data.integratedApps;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went Wrong"
      );
    }
  }
);