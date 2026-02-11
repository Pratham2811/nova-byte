import api from "@/shared/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "failed to send Otp",
      );
    }
  },
);
