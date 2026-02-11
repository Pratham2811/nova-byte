import api from "@/shared/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const getUser = createAsyncThunk(
  "auth/fetchUser",
  async (_,{ rejectWithValue }) => {
    try {
      const res = await api.get("/auth/me");
      console.log(res.data);
      
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "failed to send Otp",
      );
    }
  },
);
