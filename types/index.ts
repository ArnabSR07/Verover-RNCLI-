export interface ParkingLot {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  availableSlots: number;
  totalSlots: number;
  distance?: number;      // optional (if you calculate distance later)
}
