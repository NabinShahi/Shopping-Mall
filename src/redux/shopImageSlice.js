import { createSlice } from "@reduxjs/toolkit";

const shopImageReducer = createSlice({
  name: "shopImage",
  initialState: {
    images: [],
  },
  reducers: {
    addShopImages: (state, action) => {
      let newArray = state.images.map((img) => {
        if (img.id === action.payload.id) {
          img.images = [...img.images, ...action.payload.images];
        }
        return img;
      });

      let currentImages = state.images.find((x) => x.id === action.payload.id);

      state.images = currentImages
        ? newArray
        : [...state.images, action.payload];
    },
    deleteShopImages: (state, action) => {
      let filteredImages = state.images[action.payload.index].images.filter(
        (image) => image.name !== action.payload.filename
      );
      state.images[action.payload.index].images = filteredImages;
    },
    resetShopImages: (state, action) => {
      state.images = [];
    },
  },
});

export const {
  addShopImages,
  deleteShopImages,
  resetShopImages,
} = shopImageReducer.actions;

export default shopImageReducer.reducer;