import { configureStore } from "@reduxjs/toolkit";
import { api } from "../services/api";
import { api as authapi } from "../services/authapi";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    [authapi.reducerPath]: authapi.reducer,
  },

  // important for caching, polling, etc
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware, authapi.middleware),
});
