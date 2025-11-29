// import React, { useState } from 'react';
// import { StyleSheet, View, TextInput, Button } from 'react-native';
// import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

// const API_KEY = "AIzaSyBn5c5hk6ko6gEwZ3IyWK6AkU4_U_tp_4g";

// const Rendermap = () => {
//   const [query, setQuery] = useState("");
//   const [region, setRegion] = useState({
//     latitude: 37.7749,
//     longitude: -122.4194,
//     latitudeDelta: 0.05,
//     longitudeDelta: 0.05,
//   });

//   const searchLocation = async () => {
//     try {
//       const response = await fetch(
//         `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
//           query
//         )}&key=${API_KEY}`
//       );

//       const data = await response.json();

//       if (data.status === "OK") {
//         const loc = data.results[0].geometry.location;

//         setRegion({
//           ...region,
//           latitude: loc.lat,
//           longitude: loc.lng,
//         });
//       } else {
//         console.log("Geocode error:", data.status);
//       }
//     } catch (error) {
//       console.log("API Error:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
      
//       {/* 🔍 Search box */}
//       <View style={styles.searchWrapper}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter address..."
//           value={query}
//           onChangeText={setQuery}
//         />
//         <Button title="Search" onPress={searchLocation} />
//       </View>

//       {/* 🗺 Google Map */}
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         region={region}
//       >
//         <Marker coordinate={region} />
//       </MapView>
      
//     </View>
//   );
// };

// export default Rendermap;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   searchWrapper: {
//     flexDirection: "row",
//     padding: 10,
//     backgroundColor: "#fff",
//     zIndex: 10,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginRight: 10,
//     padding: 8,
//     borderRadius: 6,
//   },
//   map: {
//     flex: 1,
//   },
// });


import React from 'react';
import {StyleSheet, View} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Text, Platform} from 'react-native';

const Rendermap = () => {
  // if (!MapView || Platform.OS === 'web') {
  //   return (
  //     <View style={styles.mapPlaceholder}>
  //       <Text style={styles.placeholderText}>
  //         {Platform.OS === 'web' ? 'Map not available on web' : 'Loading map...'}
  //       </Text>
  //     </View>
  //   );
  // }
  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      initialRegion={{
        latitude: 37.7749,
        longitude: -122.4194,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      onMapReady={() => console.log('MAP READY')}
      onMapLoaded={() => console.log('MAP LOADED')}
    //   onRegionChangeComplete={r => console.log('REGION', r)}
    //   mapType="standard"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    height: 600,
    width: 500,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#707070',
    textAlign: 'center',
  },
});

export default Rendermap;