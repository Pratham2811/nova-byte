import api from "@/shared/services/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";


export const sendOtp = createAsyncThunk(
  "registeration/sendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/send-otp", { email });
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "failed to send Otp",
      );
    }
  },
);
export const verifyOtp = createAsyncThunk(
  "registeration/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      console.log(email);

      console.log("thunk", otp);

      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      return res.data; // backend confirmation
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Invalid OTP");
    }
  },
);

export const createAccount = createAsyncThunk(
  "registeration/createAccount",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/register", formData);
      return res.data; // backend confirmation
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Error creating account",
      );
    }
  },
);
