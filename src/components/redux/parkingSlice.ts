import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ParkingState {
    selectedPrice: string;
    selectedSpace: string;
    applyToAll: boolean;
}

const initialState: ParkingState = {
    selectedPrice: '$10',
    selectedSpace: 'A3',
    applyToAll: false,
};

const parkingSlice = createSlice({
    name: 'parking',
    initialState,
    reducers: {
        updateParkingData: (state, action: PayloadAction<ParkingState>) => {
            state.selectedPrice = action.payload.selectedPrice;
            state.selectedSpace = action.payload.selectedSpace;
            state.applyToAll = action.payload.applyToAll;
        },
    },
});

export const { updateParkingData } = parkingSlice.actions;
export default parkingSlice.reducer;
