import { createSlice } from "@reduxjs/toolkit";
import { connectGoogleDrive, getIntegrationsInfo } from "./integrationThunk";

const initialState = {
  providers: {},
};

const integrationsSlice = createSlice({
  name: "integratedApps",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(connectGoogleDrive.pending, (state) => {
        state.providers["google-drive"] = { state: "connecting" };
      })

      .addCase(connectGoogleDrive.fulfilled, (state) => {
        // console.log("this state is unwantedly connecting");
        
        // state.providers["google-drive"] = { state: "connected" };
        
      })

      .addCase(connectGoogleDrive.rejected, (state) => {
        state.providers["google-drive"] = { state: "not_connected" };
      })

      .addCase(getIntegrationsInfo.fulfilled, (state, action) => {
        const integrations = action.payload;
    
        
        state.providers = {}; // reset first

        integrations.forEach((integration) => {
          state.providers[integration.provider] = {
            state: integration.status,
            email: integration.email,
            providerAccountId: integration.providerAccountId,
          };
        });
      });
  },
});

export default integrationsSlice.reducer;
