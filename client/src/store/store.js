import integratedAppsSlice from "@/features/appIntegrations/slice/IntegrationSlice";
import authReducer from "@/features/auth/slices/authSlice.js";

import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth:authReducer,
    integratedApps:integratedAppsSlice
  },
});

export default store;
