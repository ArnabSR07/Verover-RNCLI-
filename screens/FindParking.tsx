import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

function FindParking(): React.JSX.Element {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 37.7749, // Default: San Francisco
    longitude: -122.4194,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      let permission;
      
      if (Platform.OS === 'ios') {
        permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      } else {
        permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      }

      if (permission === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to show your current location.'
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        setCurrentLocation({
          latitude,
          longitude,
        });
        
        setInitialRegion({
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Unable to get your current location');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true} 
        showsMyLocationButton={true}
        followsUserLocation={true} 
      >
        {/* Your current location marker */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="You are here"
            description="Your current location"
            pinColor="blue"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  height: 400,
  width: 500
  },
});

export default FindParking;
