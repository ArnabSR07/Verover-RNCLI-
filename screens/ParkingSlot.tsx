import React from 'react';
import { View, Text } from 'react-native';

export default function ParkingSlot({ route }) {
  const { location } = route.params;

  return (
    <View>
      <Text>Selected Location:</Text>
      <Text>Lat: {location.latitude}</Text>
      <Text>Lon: {location.longitude}</Text>
    </View>
  );
}
