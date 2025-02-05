import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserData = {
  isAuthenticated: false,
  prefersDarkMode: false
};

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    resetUserData: () => initialState,
    updateUserData: (state, action: PayloadAction<Partial<UserData>>) => {
      state = Object.assign(state, action.payload);
    }
  }
});

export const { updateUserData, resetUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
