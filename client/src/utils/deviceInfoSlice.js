/* eslint-disable no-undef */
import { createSlice } from "@reduxjs/toolkit";

export const deviceInfoSlice = createSlice({
  name: "deviceInfo",
  initialState: {
    isMobile: false,
    isTablet: false,
    isPC: false,
    dvSize: 0,
    // dvHeight:0,
    bodyHeight: 0
  },
  reducers: {
    // getWidth: (state, action) => {
    //   switch (action.payload > 0) {
    //     case action.payload <= 500:
    //       return { isMobile: true, isTablet: false, isPC: false, dvWidth:action.payload };
    //     case action.payload > 500 && action.payload < 1024:
    //       return { isMobile: false, isTablet: true, isPC: false, dvWidth:action.payload };
    //     case action.payload >= 1024:
    //       return { isMobile: false, isTablet: false, isPC: true, dvWidth:action.payload };
    //     default:
    //       return;
    //   }
    // },
    setDeviceInfo: (state, action) => {
      const { width, height } = action.payload;
      
      // Mobile: width <= 768px
      if (width <= 768) {
        return {
          isMobile: true,
          isTablet: false,
          isPC: false,
          dvSize: action.payload
        };
      }
      
      // Tablet: width between 769px and 1024px, or touch devices with specific aspect ratios
      if (width > 768 && width <= 1024) {
        return {
          isMobile: false,
          isTablet: true,
          isPC: false,
          dvSize: action.payload
        };
      }
      
      // PC/Desktop: width > 1024px
      if (width > 1024) {
        return {
          isMobile: false,
          isTablet: false,
          isPC: true,
          dvSize: action.payload
        };
      }
      
      // Default fallback
      return state;
    },
    setBodyHeight: (state, action) => {
      state.bodyHeight = action.payload;
    }

    // incrementByAmount: (state, action) => {
    //   state.value += action.payload;
    // }
  }
});

//Action creators are generated for each case reducer function
export const { setDeviceInfo, setBodyHeight } = deviceInfoSlice.actions;

export default deviceInfoSlice.reducer;
