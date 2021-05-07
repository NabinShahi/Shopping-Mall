  import { configureStore } from "@reduxjs/toolkit";
import shopImageReducer from "./shopImageSlice";
import allMallsReducer from "./mallsSlice";

const store = configureStore({
  reducer: {
    shopImageReducer,
    allMallsReducer,
  }, 
});

export default store;
