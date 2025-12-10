import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { images } from '../../assets/images/images';
import Icon from 'react-native-paper/src/components/Icon';
import colors from '../../assets/color';
import { Picker } from '@react-native-picker/picker';
import { State, City } from 'country-state-city';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { saveUserAddress, SavedAddress as ReduxSavedAddress } from '../../components/redux/userSlice';

interface PickupLocationProps {
  navigation?: any;
  route?: {
    params?: {
      dryCleanerId?: string;
      driverId?: string;
      bookingType?: 'pickup' | 'delivery';
      distance?: number;
      time?: string;
      isScheduled?: boolean; // New prop for scheduling
    };
  };
}

interface LocalSavedAddress {
  _id?: string;
  type: 'home' | 'office';
  street: string;
  city: string;
  state: string;
  zipCode: string;
  fullAddress: string;
}

interface UserProfile {
  addresses: {
    home?: LocalSavedAddress;
    office?: LocalSavedAddress;
  };
}

interface AvailableDriver {
  _id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleInfo: any;
  profileImage?: string;
  rating: number;
}

const API_BASE_URL = 'http://localhost:5000';

const PickupLocation: React.FC<PickupLocationProps> = ({ navigation, route }) => {
  // Redux hooks
  const dispatch = useDispatch();
  const savedAddresses = useSelector((state: any) => state.user?.addresses || {});

  const [selectedAddress, setSelectedAddress] = useState<string>('home');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('07030');
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // New scheduling states
  const [isScheduled, setIsScheduled] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [availableDrivers, setAvailableDrivers] = useState<AvailableDriver[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [showDriverSelection, setShowDriverSelection] = useState<boolean>(false);
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);

  // Get route params
  const { dryCleanerId, driverId, bookingType = 'pickup', distance, time, isScheduled: routeIsScheduled } = route?.params || {};

  // Set initial scheduling state
  useEffect(() => {
    if (routeIsScheduled) {
      setIsScheduled(true);
    }
  }, [routeIsScheduled]);

  // Generate time slots for the picker
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 22; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01 ${time}`).toLocaleTimeString([], { 
          hour: 'numeric', 
          minute: '2-digit', 
          hour12: true 
        });
        slots.push({ value: time, label: displayTime });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Generate dates for the next 7 days
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dateString = date.toISOString().split('T')[0];
      const displayDate = i === 0 ? 'Today' : 
                         i === 1 ? 'Tomorrow' : 
                         date.toLocaleDateString('en-US', { 
                           weekday: 'short', 
                           month: 'short', 
                           day: 'numeric' 
                         });
      
      dates.push({ value: dateString, label: displayDate });
    }
    return dates;
  };

  const dateOptions = generateDateOptions();

  // Updated authentication token function
  const checkAuthToken = async () => {
    try {
      const loginData = await AsyncStorage.getItem('loginKey');
      
      if (!loginData) {
        console.log('No loginKey found in AsyncStorage');
        return null;
      }
      
      const parsedData = JSON.parse(loginData);
      const token = parsedData.token || parsedData.user?.token;
      
      if (token && token.startsWith('eyJ')) {
        console.log('Found token in loginKey');
        return { key: 'loginKey', value: token };
      }
      
      console.log('No valid JWT token found in loginKey data');
      return null;
    } catch (error) {
      console.error('Error parsing loginKey data:', error);
      return null;
    }
  };

  // Load states on component mount
  useEffect(() => {
    const states = State.getStatesOfCountry('US');
    setStatesList(states);
    if (states.length > 0) {
      setState(states[0].isoCode);
      loadCities(states[0].isoCode);
    }
  }, []);

  // Check available drivers when date/time/dryCleanerId changes
  useEffect(() => {
    if (isScheduled && selectedDate && selectedTime && dryCleanerId) {
      checkAvailableDrivers();
    }
  }, [selectedDate, selectedTime, dryCleanerId, isScheduled]);

  // Check available drivers for scheduling
  const checkAvailableDrivers = async () => {
    if (!selectedDate || !selectedTime || !dryCleanerId) return;

    setCheckingAvailability(true);
    try {
      const tokenInfo = await checkAuthToken();
      if (!tokenInfo) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const token = tokenInfo.value;
      const url = `${API_BASE_URL}/api/booking/available-drivers?date=${selectedDate}&time=${selectedTime}&dryCleanerId=${dryCleanerId}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAvailableDrivers(data.data.drivers || []);
        
        // If a specific driver was pre-selected, check if they're available
        if (driverId) {
          const isDriverAvailable = data.data.drivers.some((driver: AvailableDriver) => driver._id === driverId);
          if (isDriverAvailable) {
            setSelectedDriverId(driverId);
          } else {
            Alert.alert(
              'Driver Unavailable',
              'The selected driver is not available at this time. Please choose another driver.',
              [{ text: 'OK' }]
            );
            setSelectedDriverId('');
          }
        }
      } else {
        const errorData = await response.json();
        console.log('Available drivers error:', errorData);
        Alert.alert('Error', 'Failed to check driver availability');
      }
    } catch (error) {
      console.error('Error checking available drivers:', error);
      Alert.alert('Error', 'Failed to check driver availability');
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Load cities when state changes
  const loadCities = (stateCode: string) => {
    const cities = City.getCitiesOfState('US', stateCode);
    setCitiesList(cities);
    if (cities.length > 0) {
      setCity(cities[0].name);
    }
  };

  // Handle state change
  const handleStateChange = (stateCode: string) => {
    setState(stateCode);
    loadCities(stateCode);
  };

  // Handle address type selection
  const handleAddressSelect = (type: string) => {
    setSelectedAddress(type);
    
    if (type === 'home' && savedAddresses.home) {
      const homeAddr = savedAddresses.home;
      setAddress(homeAddr.street);
      setCity(homeAddr.city);
      setState(homeAddr.state);
      setZipCode(homeAddr.zipCode);
      loadCities(homeAddr.state);
    } else if (type === 'office' && savedAddresses.office) {
      const officeAddr = savedAddresses.office;
      setAddress(officeAddr.street);
      setCity(officeAddr.city);
      setState(officeAddr.state);
      setZipCode(officeAddr.zipCode);
      loadCities(officeAddr.state);
    } else if (type === 'new') {
      setAddress('');
      setCity(citiesList.length > 0 ? citiesList[0].name : '');
      setState(statesList.length > 0 ? statesList[0].isoCode : '');
      setZipCode('');
    }
  };

  // Save address to Redux store
  const saveAddress = async (addressType: 'home' | 'office') => {
    if (!address || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all address fields');
      return false;
    }

    try {
      const fullAddress = `${address}, ${city}, ${getStateName(state)}, ${zipCode}`;
      const addressData: ReduxSavedAddress = {
        type: addressType,
        street: address,
        city,
        state,
        zipCode,
        fullAddress,
      };

      // Save to Redux store
      dispatch(saveUserAddress(addressData));
      
      console.log('Address saved to Redux:', addressData);
      return true;
    } catch (error) {
      console.error('Error saving address to Redux:', error);
      return false;
    }
  };

  // Create immediate booking request
  const createBookingRequest = async () => {
    if (!dryCleanerId || !driverId || !distance || !time) {
      Alert.alert('Error', 'Missing booking information');
      return;
    }

    if (!address || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please complete the address information');
      return;
    }

    setLoading(true);

    try {
      const tokenInfo = await checkAuthToken();
      if (!tokenInfo) {
        Alert.alert('Error', 'Authentication required');
        setLoading(false);
        return;
      }

      const token = tokenInfo.value;
      const fullAddress = `${address}, ${city}, ${getStateName(state)}, ${zipCode}`;
      
      const bookingData = {
        dryCleanerId,
        driverId,
        pickupAddress: fullAddress,
        dropoffAddress: bookingType === 'delivery' ? fullAddress : undefined,
        distance: Number(distance),
        time: Number(time),
        bookingType,
        message: `${bookingType === 'pickup' ? 'Pickup' : 'Delivery'} request from ${selectedAddress} address`,
      };

      console.log('Booking data being sent:', bookingData);

      const response = await fetch(`${API_BASE_URL}/api//users/booking/user/booking-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();
      console.log('Booking response:', responseData);

      if (response.ok) {
        Alert.alert(
          'Success',
          'Booking request sent to driver successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (responseData.data && responseData.data.booking && responseData.data.booking._id) {
                  navigation.navigate('BookingStatus', { 
                    bookingId: responseData.data.booking._id 
                  });
                } else {
                  navigation.goBack();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', responseData.message || 'Failed to create booking request');
      }
    } catch (error) {
      console.error('Error creating booking:', error);
      Alert.alert('Error', 'Failed to create booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create scheduled booking request
  const createScheduledBookingRequest = async () => {
    if (!dryCleanerId || !selectedDriverId || !distance || !time) {
      Alert.alert('Error', 'Missing booking information');
      return;
    }

    if (!address || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please complete the address information');
      return;
    }

    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select date and time for pickup');
      return;
    }

    setLoading(true);

    try {
      const tokenInfo = await checkAuthToken();
      if (!tokenInfo) {
        Alert.alert('Error', 'Authentication required');
        setLoading(false);
        return;
      }

      const token = tokenInfo.value;
      const fullAddress = `${address}, ${city}, ${getStateName(state)}, ${zipCode}`;
      
      const bookingData = {
        dryCleanerId,
        driverId: selectedDriverId,
        pickupAddress: fullAddress,
        distance: Number(distance),
        time: Number(time),
        scheduledPickupDate: selectedDate,
        scheduledPickupTime: selectedTime,
        message: `Scheduled pickup request from ${selectedAddress} address`,
      };

      console.log('Scheduled booking data being sent:', bookingData);

      const response = await fetch(`${API_BASE_URL}/api/users/booking/scheduled-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();
      console.log('Scheduled booking response:', responseData);

      if (response.ok) {
        Alert.alert(
          'Success',
          'Scheduled booking request sent to driver successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                if (responseData.data && responseData.data.booking && responseData.data.booking._id) {
                  navigation.navigate('BookingStatus', { 
                    bookingId: responseData.data.booking._id 
                  });
                } else {
                  navigation.goBack();
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', responseData.message || 'Failed to create scheduled booking request');
      }
    } catch (error) {
      console.error('Error creating scheduled booking:', error);
      Alert.alert('Error', 'Failed to create scheduled booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle continue button
  const handleContinue = async () => {
    if (!address || !city || !state || !zipCode) {
      Alert.alert('Error', 'Please fill in all address fields');
      return;
    }

    // Save address if it's home or office type
    if (selectedAddress === 'home' || selectedAddress === 'office') {
      try {
        await saveAddress(selectedAddress);
      } catch (error) {
        console.log('Address save failed, but continuing...', error);
      }
    }

    // If we have booking parameters, create the booking
    if (dryCleanerId && (driverId || isScheduled)) {
      if (isScheduled) {
        if (!selectedDriverId) {
          Alert.alert('Error', 'Please select a driver for your scheduled pickup');
          return;
        }
        await createScheduledBookingRequest();
      } else {
        await createBookingRequest();
      }
    } else {
      // Navigate to next step (DropLocation)
      const fullAddress = `${address}, ${city}, ${getStateName(state)}, ${zipCode}`;
      navigation.navigate('PickTime', {
        pickupAddress: fullAddress,
        selectedAddressType: selectedAddress,
      });
    }
  };

  // Get address title based on selected address type
  const getAddressTitle = () => {
    if (selectedAddress === 'home') return 'Enter Home Address Details';
    if (selectedAddress === 'office') return 'Enter Office Address Details';
    if (selectedAddress === 'new') return 'Enter New Address Details';
    return 'Enter Address Details';
  };

  // Get state name from state code
  const getStateName = (stateCode: string) => {
    const stateObj = statesList.find(state => state.isoCode === stateCode);
    return stateObj ? stateObj.name : '';
  };

  // Check if address is saved and available
  const isAddressAvailable = (type: 'home' | 'office') => {
    return savedAddresses[type] && Object.keys(savedAddresses[type]!).length > 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.title}>
            {dryCleanerId && (driverId || isScheduled) ? 'Confirm Pickup Location' : 'Pickup Location'}
          </Text>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            {dryCleanerId && (driverId || isScheduled) ? 'Enter your pickup address to send booking request' : 'Select Pickup Address'}
          </Text>
        </View>

        {/* Show booking info if available */}
        {dryCleanerId && (driverId || isScheduled) && (
          <View style={styles.bookingInfoContainer}>
            <Text style={styles.bookingInfoTitle}>Booking Details</Text>
            <Text style={styles.bookingInfoText}>Type: {isScheduled ? 'Scheduled' : bookingType}</Text>
            <Text style={styles.bookingInfoText}>Distance: {distance} km</Text>
            <Text style={styles.bookingInfoText}>Time: {time} mins</Text>
            <Text style={styles.bookingInfoText}>Price: ₹{distance ? (Number(distance) * 10) : 0}</Text>
          </View>
        )}

        {/* Scheduling Toggle */}
        {!driverId && dryCleanerId && (
          <View style={styles.schedulingToggle}>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                !isScheduled && styles.toggleButtonActive
              ]}
              onPress={() => setIsScheduled(false)}
            >
              <Text style={[
                styles.toggleButtonText,
                !isScheduled && styles.toggleButtonTextActive
              ]}>
                Book Now
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                isScheduled && styles.toggleButtonActive
              ]}
              onPress={() => setIsScheduled(true)}
            >
              <Text style={[
                styles.toggleButtonText,
                isScheduled && styles.toggleButtonTextActive
              ]}>
                Schedule Later
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Date and Time Selection for Scheduled Bookings */}
        {isScheduled && (
          <View style={styles.schedulingSection}>
            <Text style={styles.schedulingTitle}>Select Pickup Date & Time</Text>
            
            {/* Date Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {selectedDate ? 
                    dateOptions.find(d => d.value === selectedDate)?.label || selectedDate :
                    'Select Date'
                  }
                </Text>
                <Icon source="calendar" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Time Selection */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity
                style={styles.dateTimeButton}
                onPress={() => setShowTimePicker(true)}
              >
                <Text style={styles.dateTimeButtonText}>
                  {selectedTime ? 
                    timeSlots.find(t => t.value === selectedTime)?.label || selectedTime :
                    'Select Time'
                  }
                </Text>
                <Icon source="clock-outline" size={20} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Available Drivers */}
            {selectedDate && selectedTime && dryCleanerId && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Available Drivers</Text>
                {checkingAvailability ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#F99026" />
                    <Text style={styles.loadingText}>Checking availability...</Text>
                  </View>
                ) : availableDrivers.length > 0 ? (
                  <TouchableOpacity
                    style={styles.dateTimeButton}
                    onPress={() => setShowDriverSelection(true)}
                  >
                    <Text style={styles.dateTimeButtonText}>
                      {selectedDriverId ? 
                        availableDrivers.find(d => d._id === selectedDriverId)?.firstName + ' ' +
                        availableDrivers.find(d => d._id === selectedDriverId)?.lastName :
                        'Select Driver'
                      }
                    </Text>
                    <Icon source="account" size={20} color="#666" />
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.noDriversText}>No drivers available at this time</Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Address Options */}
        <View style={styles.addressOptions}>
          <TouchableOpacity
            style={[
              styles.addressCard, 
              selectedAddress === 'home' && styles.selectedAddressCard
            ]}
            onPress={() => handleAddressSelect('home')}>
            <Image source={images.home} style={styles.addressIcon} resizeMode="cover" />
            <Text style={styles.addressText}>
              Home {isAddressAvailable('home') ? '✓' : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addressCard, 
              selectedAddress === 'office' && styles.selectedAddressCard
            ]}
            onPress={() => handleAddressSelect('office')}>
            <Image source={images.business} style={styles.addressIcon} resizeMode="cover" />
            <Text style={styles.addressText}>
              Office {isAddressAvailable('office') ? '✓' : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addressCard, 
              selectedAddress === 'new' && styles.selectedAddressCard
            ]}
            onPress={() => handleAddressSelect('new')}>
            <Image source={images.business} style={styles.addressIcon} resizeMode="cover" />
            <Text style={styles.addressText}>New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Address Form */}
        {(selectedAddress === 'new' || selectedAddress === 'home' || selectedAddress === 'office') && (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>{getAddressTitle()}</Text>

            {/* Address Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Address"
                value={address}
                onChangeText={setAddress}
                editable={!loading}
              />
            </View>

            {/* State Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>State</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={state}
                  onValueChange={handleStateChange}
                  style={styles.picker}
                  enabled={!loading}>
                  {statesList.map((state) => (
                    <Picker.Item key={state.isoCode} label={state.name} value={state.isoCode} />
                  ))}
                </Picker>
                <Image source={images.dropdownarrow} style={styles.dropdownIcon} resizeMode="cover" />
              </View>
            </View>

            {/* City Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={city}
                  onValueChange={setCity}
                  style={styles.picker}
                  enabled={!loading}>
                  {citiesList.map((city) => (
                    <Picker.Item key={city.name} label={city.name} value={city.name} />
                  ))}
                </Picker>
                <Image source={images.dropdownarrow} style={styles.dropdownIcon} resizeMode="cover" />
              </View>
            </View>

            {/* ZIP Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                maxLength={5}
                editable={!loading}
              />
            </View>
          </View>
        )}

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity 
            style={[styles.continueButton, loading && { opacity: 0.7 }]} 
            onPress={handleContinue}
            disabled={loading || (isScheduled && !selectedDriverId)}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.continueButtonText}>
                {dryCleanerId && (driverId || isScheduled) ? 'Send Booking Request' : 'Continue'}
              </Text>
            )}
          </TouchableOpacity>
          
          {/* Only show skip button if not in booking mode */}
          {!dryCleanerId && !driverId && (
            <TouchableOpacity 
              style={[styles.skipButton, loading && { opacity: 0.7 }]} 
              onPress={() => navigation.navigate('DropLocation')}
              disabled={loading}>
              <Text style={styles.skipButtonText}>Skip This Step</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDatePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <ScrollView style={styles.optionsList}>
              {dateOptions.map((date) => (
                <TouchableOpacity
                  key={date.value}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedDate(date.value);
                    setShowDatePicker(false);
                  }}>
                  <Text style={styles.optionText}>{date.label}</Text>
                  {selectedDate === date.value && (
                    <Icon source="check" size={20} color="#F99026" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDatePicker(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTimePicker(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <ScrollView style={styles.optionsList}>
              {timeSlots.map((time) => (
                <TouchableOpacity
                  key={time.value}
                  style={styles.optionItem}
                  onPress={() => {
                    setSelectedTime(time.value);
                    setShowTimePicker(false);
                  }}>
                  <Text style={styles.optionText}>{time.label}</Text>
                  {selectedTime === time.value && (
                    <Icon source="check" size={20} color="#F99026" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowTimePicker(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Driver Selection Modal */}
      <Modal
        visible={showDriverSelection}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDriverSelection(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Driver</Text>
            <ScrollView style={styles.optionsList}>
              {availableDrivers.map((driver) => (
                <TouchableOpacity
                  key={driver._id}
                  style={styles.driverOptionItem}
                  onPress={() => {
                    setSelectedDriverId(driver._id);
                    setShowDriverSelection(false);
                  }}>
                  <View style={styles.driverInfo}>
                    <Text style={styles.driverName}>
                      {driver.firstName} {driver.lastName}
                    </Text>
                    <Text style={styles.driverDetails}>
                      {driver.vehicleInfo?.vehicleNumber} • ⭐ {driver.rating || 0}
                    </Text>
                    <Text style={styles.driverPhone}>{driver.phoneNumber}</Text>
                  </View>
                  {selectedDriverId === driver._id && (
                    <Icon source="check" size={20} color="#F99026" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setShowDriverSelection(false)}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  logo: {
    height: 24,
    width: 100,
    resizeMode: 'contain',
  },
  icon: {
    width: 24,
    height: 24,
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 74,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 8,
    color: '#000000',
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
  },
  orderHistory: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: '300',
  },
  bookingInfoContainer: {
    backgroundColor: '#F8F9FA',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F99026',
  },
  bookingInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  bookingInfoText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  schedulingToggle: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 21,
  },
  toggleButtonActive: {
    backgroundColor: '#F99026',
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666666',
  },
  toggleButtonTextActive: {
    color: '#FFFFFF',
  },
  schedulingSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  schedulingTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 16,
  },
  dateTimeButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 12,
  },
  dateTimeButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
  noDriversText: {
    fontSize: 14,
    color: '#FF6B6B',
    paddingVertical: 12,
    fontStyle: 'italic',
  },
  addressOptions: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 12,
    marginBottom: 32,
  },
  addressCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 19,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressIcon: {
    width: 34,
    height: 39,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#000000',
  },
  formSection: {
    paddingHorizontal: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 24,
    color: '#707070',
  },
  inputContainer: {
    marginBottom: 30,
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
    fontSize: 16,
    color: '#000000',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  picker: {
    flex: 1,
    color: '#000000',
    height: 50,
  },
  dropdownIcon: {
    width: 16,
    height: 10,
    left: -10,
    tintColor: '#9D9D9D',
  },
  bottomButtons: {
    padding: 16,
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: '#F99026',
    borderRadius: 29,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: '#5E5E60',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedAddressCard: {
    backgroundColor: '#FDF1E5',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    color: '#333333',
  },
  optionsList: {
    maxHeight: 300,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  driverOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  driverDetails: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 2,
  },
  driverPhone: {
    fontSize: 12,
    color: '#999999',
  },
  modalCloseButton: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
});

export default PickupLocation;