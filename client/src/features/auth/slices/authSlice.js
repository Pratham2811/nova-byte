import { createSlice } from "@reduxjs/toolkit";
import {
  sendOtp,
  verifyOtp,
  createAccount,
} from "../thunks/registrationThunks";
import { login } from "../thunks/loginThunk";
import { getUser } from "../thunks/sessionThunk";

const initialState = {
  user: null,
  status: "unauthenticated",
  error: null,
  isLoading: false,
  registeration: {
    step: "EMAIL",
    formData: {
      email: "",
      username: "",
      password: "",
    },
  },
  login: {
    email: "",
    password: "",
  },
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateFormData(state, action) {
      state.registeration.formData = {
        ...state.registeration.formData,
        ...action.payload,
      };
    },
    goBack(state, action) {
      if (state.registeration.step === "INFO") {
        state.registeration.step = "EMAIL";
      }
      if (state.registeration.step === "OTP") {
        state.registeration.step = "EMAIL";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.registeration.step = "OTP";
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state, action) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        ((state.isLoading = false),
          (state.otpVerified = true),
          (state.error = null),
          (state.registeration.step = "INFO"));
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAccount.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "authenticated";
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading=false,
        state.user = action.payload.user;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { updateFormData, goBack } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;
