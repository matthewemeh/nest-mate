import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserData = {
  isOtpVerified: false,
  isAuthenticated: false,
  prefersDarkMode: false
};

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      state = Object.assign(state, action.payload);
    },
    resetUserData: () => initialState
  }
});

export const { updateUserData, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
