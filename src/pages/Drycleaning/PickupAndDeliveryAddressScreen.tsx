import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import type {NavigationProp, RouteProp} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import axiosInstance from '../../api/axios';
import type {RootState} from '../../components/redux/store';

interface RouteParams {
  bookingId?: string;
  currentPickupAddress?: string;
  currentDropoffAddress?: string;
  orderNumber?: string;
}

const PickupAndDeliveryAddressScreen = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<{params: RouteParams}, 'params'>>();
  
  // Get route params
  const { 
    bookingId, 
    currentPickupAddress, 
    currentDropoffAddress, 
    orderNumber 
  } = route.params || {};

  // Get user from Redux for authentication
  const user = useSelector((state: RootState) => state.auth.user);
  
  // Form states
  const [selectedAddress, setSelectedAddress] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupAddress, setPickupAddress] = useState(currentPickupAddress || '125, Lincoln Street, New York');
  const [dropoffAddress, setDropoffAddress] = useState(currentDropoffAddress || '30 Lincoln St, New Rochelle, New York');
  const [newAddress, setNewAddress] = useState('');
  const [city, setCity] = useState('Pleasanton');
  const [state, setState] = useState('California');
  const [zipCode, setZipCode] = useState('07000');
  
  // UI states
  const [updating, setUpdating] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('PickupAndDeliveryAddressScreen - Route params:', {
      bookingId,
      currentPickupAddress,
      currentDropoffAddress,
      orderNumber
    });
    
    // Initialize addresses from route params
    if (currentPickupAddress) {
      setPickupAddress(currentPickupAddress);
    }
    if (currentDropoffAddress) {
      setDropoffAddress(currentDropoffAddress);
    }
  }, [bookingId, currentPickupAddress, currentDropoffAddress, orderNumber]);

  // Update address function
  const updateAddress = useCallback(async () => {
    if (!bookingId) {
      Alert.alert('Error', 'Booking ID is required to update address');
      return;
    }

    if (!user?.token) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    let addressToUpdate = '';
    let endpoint = '';
    
    if (selectedAddress === 'pickup') {
      addressToUpdate = newAddress.trim() || pickupAddress.trim();
      endpoint = 'pickup-address';
      
      if (!addressToUpdate) {
        Alert.alert('Error', 'Please enter a valid pickup address');
        return;
      }
    } else {
      addressToUpdate = newAddress.trim() || dropoffAddress.trim();
      endpoint = 'delivery-address';
      
      if (!addressToUpdate) {
        Alert.alert('Error', 'Please enter a valid delivery address');
        return;
      }
    }

    try {
      setUpdating(true);
      
      console.log('Updating address:', {
        bookingId,
        addressType: selectedAddress,
        newAddress: addressToUpdate,
        endpoint
      });

      const requestPayload = selectedAddress === 'pickup' 
        ? { pickupAddress: addressToUpdate }
        : { dropoffAddress: addressToUpdate };

      const response = await axiosInstance.put(
        `users/bookings/${bookingId}/${endpoint}`, 
        requestPayload, 
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json',
          },
          timeout: 10000,
        }
      );

      console.log('Address update response:', response.data);

      if (response.status === 200 && response.data) {
        // Update local state
        if (selectedAddress === 'pickup') {
          setPickupAddress(addressToUpdate);
        } else {
          setDropoffAddress(addressToUpdate);
        }
        
        setNewAddress(''); // Clear the input field
        
        Alert.alert(
          'Success', 
          `${selectedAddress === 'pickup' ? 'Pickup' : 'Delivery'} address updated successfully`,
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back to OrderDetailsScreen
                navigation.goBack();
              }
            }
          ]
        );
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error: any) {
      console.error('Address update error:', error);
      
      let errorMessage = `Failed to update ${selectedAddress} address`;
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || error.response.data?.error || 'Invalid request data';
            break;
          case 401:
            errorMessage = 'Unauthorized - please login again';
            break;
          case 404:
            errorMessage = 'Booking not found';
            break;
          case 500:
            errorMessage = 'Server error - please try again';
            break;
          default:
            errorMessage = `Server error (${error.response.status})`;
        }
      } else if (error.request) {
        errorMessage = 'Network error - check your connection';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setUpdating(false);
    }
  }, [bookingId, user?.token, selectedAddress, newAddress, pickupAddress, dropoffAddress, navigation]);

  // Handle back button
  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle done button - either update address or just go back
  const handleDone = useCallback(() => {
    if (bookingId && newAddress.trim()) {
      // If we have a booking ID and new address, update it
      updateAddress();
    } else {
      // Otherwise just go back
      navigation.goBack();
    }
  }, [bookingId, newAddress, updateAddress, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {bookingId ? `Update Address - ${orderNumber || 'Booking'}` : 'Book Dry Cleaners'}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Map Container */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapText}>Map View</Text>
            {/* Map markers */}
            <View style={[styles.marker, { top: 60, left: 150 }]}>
              <View style={styles.markerIcon}>
                <Text style={styles.markerText}>📍</Text>
              </View>
            </View>
            <View style={[styles.marker, { top: 120, right: 80 }]}>
              <View style={[styles.markerIcon, styles.orangeMarker]}>
                <Text style={styles.markerText}>🏠</Text>
              </View>
            </View>
          </View>
          
          {/* Location Button */}
          <TouchableOpacity style={styles.locationButton}>
            <Icon name="my-location" size={20} color="#FF8C00" />
          </TouchableOpacity>
        </View>

        {/* Address Selection */}
        <View style={styles.addressSection}>
          <Text style={styles.sectionTitle}>Pickup and Delivery Address</Text>
          
          {/* Pickup Address */}
          <TouchableOpacity 
            style={[styles.addressItem, selectedAddress === 'pickup' && styles.selectedAddress]}
            onPress={() => setSelectedAddress('pickup')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, selectedAddress === 'pickup' && styles.checkedBox]}>
                {selectedAddress === 'pickup' && <Icon name="check" size={14} color="#fff" />}
              </View>
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Pickup</Text>
              <Text style={styles.addressText}>{pickupAddress}</Text>
            </View>
          </TouchableOpacity>

          {/* Delivery Address */}
          <TouchableOpacity 
            style={[styles.addressItem, selectedAddress === 'delivery' && styles.selectedAddress]}
            onPress={() => setSelectedAddress('delivery')}
          >
            <View style={styles.checkboxContainer}>
              <View style={[styles.checkbox, selectedAddress === 'delivery' && styles.checkedBox]}>
                {selectedAddress === 'delivery' && <Icon name="check" size={14} color="#fff" />}
              </View>
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressLabel}>Drop Off</Text>
              <Text style={styles.addressText}>{dropoffAddress}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Change Address Section */}
        <View style={styles.changeAddressSection}>
          
          <Text style={styles.inputLabel}>Address</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Your Address"
            placeholderTextColor="#999"
            value={newAddress}
            onChangeText={setNewAddress}
            multiline={true}
            numberOfLines={2}
            textAlignVertical="top"
          />

          <Text style={styles.inputLabel}>City</Text>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownText}>{city}</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#666" />
          </View>

          <Text style={styles.inputLabel}>State</Text>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownText}>{state}</Text>
            <Icon name="keyboard-arrow-down" size={20} color="#666" />
          </View>

          <Text style={styles.inputLabel}>Zip Code</Text>
          <TextInput
            style={styles.textInput}
            value={zipCode}
            onChangeText={setZipCode}
            placeholder="Zip Code"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {bookingId && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.updateButton]}
              onPress={updateAddress}
              disabled={updating || !newAddress.trim()}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <Icon name="update" size={18} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.updateButtonText}>
                    Update {selectedAddress === 'pickup' ? 'Pickup' : 'Delivery'} Address
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.doneButton]}
            onPress={handleDone}
            disabled={updating}
          >
            <Text style={styles.doneButtonText}>
              {bookingId && newAddress.trim() ? 'Update & Close' : 'Done'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginRight: 24, // To balance the back button space
  },
  content: {
    flex: 1,
  },
  mapContainer: {
    height: 200,
    backgroundColor: '#f8f8f8',
    position: 'relative',
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8e8e8',
  },
  mapText: {
    color: '#666',
    fontSize: 16,
  },
  marker: {
    position: 'absolute',
  },
  markerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  orangeMarker: {
    backgroundColor: '#FF8C00',
  },
  markerText: {
    fontSize: 12,
  },
  locationButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addressSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    position: 'relative',
  },
  selectedAddress: {
    
  },
  checkboxContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF8C00',
  },
  addressInfo: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 16,
    marginHorizontal: 16,
  },
  changeAddressSection: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
    minHeight: 48,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    minHeight: 48,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
    paddingBottom: 32,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  updateButton: {
    backgroundColor: '#4CAF50',
  },
  doneButton: {
    backgroundColor: '#FF8C00',
  },
  buttonIcon: {
    marginRight: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PickupAndDeliveryAddressScreen;