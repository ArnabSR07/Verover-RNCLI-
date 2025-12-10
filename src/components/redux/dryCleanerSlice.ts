import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface DryCleanerState {
  name: string;
  streetAddress: string;
  contactName: string;
  phone: string;
  imageUri: string | null;
  about: string;
}

const initialState: DryCleanerState = {
  name: 'Mico Cleaners',
  streetAddress: '123, Lincoln Street, New York',
  contactName: 'Jason Anderson',
  phone: '123-456-7890',
  imageUri: null,
  about: 'Edit details about dry cleaning merchant',
};

const dryCleanerSlice = createSlice({
  name: 'dryCleaner',
  initialState,
  reducers: {
    updateDryCleaner: (state, action: PayloadAction<Partial<DryCleanerState>>) => {
      return { ...state, ...action.payload };
    },
    updateAbout: (state, action: PayloadAction<string>) => {
      state.about = action.payload;
    },
  },
});

export const { updateDryCleaner, updateAbout } = dryCleanerSlice.actions;
export default dryCleanerSlice.reducer;
