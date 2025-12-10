import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const LocationPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedAddress, setSelectedAddress] = useState('Home');
  const { cleaner } = route.params;

  // demo cities and states

  const usStates = [
    'California',
    'Texas',
    'New York',
    'Florida',
    'Illinois',
    'Washington',
    'Arizona',
  ];

  const usCities = {
    California: ['Los Angeles', 'San Diego', 'San Francisco', 'Sacramento'],
    Texas: ['Houston', 'Dallas', 'Austin', 'San Antonio'],
    'New York': ['New York City', 'Buffalo', 'Albany'],
    Florida: ['Miami', 'Orlando', 'Tampa'],
    Illinois: ['Chicago', 'Springfield'],
    Washington: ['Seattle', 'Spokane'],
    Arizona: ['Phoenix', 'Tempe', 'Tucson'],
  };

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const [stateDropdownVisible, setStateDropdownVisible] = useState(false);
  const [cityDropdownVisible, setCityDropdownVisible] = useState(false);

  return (
    <View>
      <View style={styles.navbar}>
        <View>
          <Text style={{ color: 'black', fontWeight: 800, fontSize: 20 }}>
            Verover
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <Feather name="search" color="#000" size={24} />
          <Ionicons name="wallet-outline" color="#000" size={24} />
          <MaterialIcons name="notifications-none" color="#000" size={24} />
        </View>
      </View>
      <ScrollView style={{ paddingVertical: 90 }}>
        <View style={{ paddingHorizontal: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 40,
              paddingHorizontal: 20,
              marginBottom: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.navigate('Services', { cleaner })}
            >
              <AntDesign name="arrowleft" color="orange" size={24} />
            </TouchableOpacity>
            <Text style={{ fontSize: 20, fontWeight: 'semibold' }}>
              Pickup Location
            </Text>
          </View>
          <Text
            style={{ fontSize: 18, fontWeight: 'light', paddingHorizontal: 15 }}
          >
            Select Pickup Address
          </Text>

          {/* Address Options */}

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginVertical: 20,
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => setSelectedAddress('Home')}
              style={[
                styles.address,
                selectedAddress == 'Home'
                  ? { backgroundColor: '#FFE5B4' }
                  : { backgroundColor: 'white' },
              ]}
            >
              <Ionicons name="home" color="orange" size={55} />
              <Text>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedAddress('Office')}
              style={[
                styles.address,
                selectedAddress == 'Office'
                  ? { backgroundColor: '#FFE5B4' }
                  : { backgroundColor: 'white' },
              ]}
            >
              <MaterialCommunityIcons
                name="office-building"
                color="orange"
                size={55}
              />
              <Text>Office</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedAddress('New')}
              style={[
                styles.address,
                selectedAddress == 'New'
                  ? { backgroundColor: '#FFE5B4' }
                  : { backgroundColor: 'white' },
              ]}
            >
              <FontAwesome name="building" color="orange" size={55} />
              <Text>New Address</Text>
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: 20,
              fontWeight: 'semibold',
              color: 'gray',
              marginVertical: 20,
            }}
          >
            Enter {selectedAddress} Address Details
          </Text>
          <View style={{ flex: 1, gap: 20 }}>
            <View style={{ flex: 1, gap: 10 }}>
              <Text>Address</Text>
              <TextInput style={styles.input}></TextInput>
            </View>

            <View style={{ flex: 1, gap: 10 }}>
              <Text>State</Text>
              <TextInput style={styles.input}></TextInput>
            </View>

            <View style={{ flex: 1, gap: 10 }}>
              <Text>City</Text>
              <TextInput style={styles.input}></TextInput>
            </View>

            <View style={{ flex: 1, gap: 10 }}>
              <Text>ZIP Code</Text>
              <TextInput style={styles.input}></TextInput>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={styles.btn1}
                onPress={() => navigation.navigate('Schedule', { cleaner })}
              >
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Continue
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btn2}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  Skip This Step
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default LocationPage;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
    position: 'absolute',
    top: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 8,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: '#000', // choose any color
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
  btn1: {
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: 'orange',
  },
  btn2: {
    width: '90%',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
    backgroundColor: 'gray',
  },
  address: {
    borderRadius: 15,
    height: 120,
    width: 120,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
