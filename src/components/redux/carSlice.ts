import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for the car and form data
interface Car {
  id: string;
  brand: string;
  model: string;
  type: string;
  fuelType: string;
  gearboxType: string;
  photos: string[];
  documents: string[];
  noOfSeats?: string;
  kilometers?: string;
  avgMileage?: string;
  purchasedYear?: string;
  carNumberPlate?: string;
  description?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

interface FormData {
  carBrand: string;
  carModel: string;
  carType: string;
  fuelType: string;
  gearboxType: string;
  noOfSeats: string;
  kilometers: string;
  avgMileage: string;
  purchasedYear: string;
  carNumberPlate: string;
  description: string;
  insuranceProvider: string;
  insuranceNumber: string;
  carPhotos: Array<{ id: number; source: string | number }>;
  carDocuments: Array<{ id: number; source: string | number }>;
}

interface CarsState {
  cars: Car[];
  formData: FormData;
}

// Initial state
const initialState: CarsState = {
  cars: [],
  formData: {
    carBrand: '',
    carModel: '',
    carType: '',
    fuelType: '',
    gearboxType: '',
    noOfSeats: '',
    kilometers: '',
    avgMileage: '',
    purchasedYear: '',
    carNumberPlate: '',
    description: '',
    insuranceProvider: '',
    insuranceNumber: '',
    carPhotos: [],
    carDocuments: [],
  },
};

// Create the slice
const carsSlice = createSlice({
  name: 'cars',
  initialState,
  reducers: {
    // ✅ Add a new car to the list
    addCar: (state, action: PayloadAction<Car>) => {
      console.log('🚗 Adding new car:', action.payload);
      state.cars.push(action.payload);
      console.log('✔️ Updated cars list:', state.cars);
    },

    // ✅ Delete a car by ID
    deleteCar: (state, action: PayloadAction<string>) => {
      const carId = action.payload;
      console.log(`🗑 Deleting car with ID: ${carId}`);

      // Filter out the car from the array
      state.cars = state.cars.filter((car) => car.id !== carId);

      console.log('✔️ Cars after deletion:', state.cars);
    },

    // ✅ Update the form data in the Redux store
    updateFormData: (state, action: PayloadAction<Partial<FormData>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    // ✅ Reset the form data to its initial state
    resetFormData: (state) => {
      state.formData = initialState.formData;
    },

    // ✅ Update a specific car in the list
    updateCar: (state, action: PayloadAction<Car>) => {
      const index = state.cars.findIndex((car) => car.id === action.payload.id);
      if (index !== -1) {
        state.cars[index] = action.payload;
      }
    },
  },
});

// Export actions
export const { addCar, deleteCar, updateFormData, resetFormData, updateCar } = carsSlice.actions;

// Export the reducer
export default carsSlice.reducer;
