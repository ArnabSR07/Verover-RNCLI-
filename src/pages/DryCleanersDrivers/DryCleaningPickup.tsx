import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import {images} from '../../assets/images/images';
import colors from '../../assets/color';
import {useNavigation, useRoute} from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';
const {width, height} = Dimensions.get('window');

const DryCleaningPickup = () => {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute();
  type NavigationProps = StackNavigationProp<RootStackParamList>;
  
  // Get provider data from navigation params
  const { providerData } = route.params || {};
  
  // State management
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(providerData || null);

  // Updated token - use the new token from your logs
  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk5ODBiNzg5Njk5ODM0M2UwZTRkOGQiLCJ1c2VyVHlwZSI6ImRyaXZlciIsImlhdCI6MTc1NzU3NzM5MSwiZXhwIjoxNzYwMTY5MzkxfQ.niu7DRuQVBKjbQvU0IecNXuHQe55nQ-QC4GfhP3XuEc";
  };

  // Enhanced API call with better error handling - FIXED SIGNATURE
  const makeApiCall = async (url, body, method = 'PUT') => {
    try {
      const token = getAuthToken();
      console.log('Making API call to:', url);
      console.log('Request method:', method);
      console.log('Request body:', JSON.stringify(body, null, 2));
      console.log('Using token:', token.substring(0, 50) + '...');

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(body),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      // Get response text first to see what we're actually receiving
      const responseText = await response.text();
      console.log('Raw response text:', responseText.substring(0, 500));

      // Try to parse as JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.log('Response was not valid JSON. Full response:', responseText);
        throw new Error(`Server returned invalid JSON. Status: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { success: true, data };
    } catch (error) {
      console.error('API call error:', error);
      return { success: false, error: error.message };
    }
  };

  // Handle accepting booking request - FIXED
  const handleAcceptBooking = async () => {
    if (!bookingDetails?.id) {
      Alert.alert('Error', 'Invalid booking data - no booking ID found');
      return;
    }

    try {
      setIsAccepting(true);
      
      const requestBody = {
        bookingId: bookingDetails.id,
        response: 'accept'
      };

      // Use the CORRECT endpoint with PUT method
      const correctEndpoint = 'http://localhost:5000/api/users/driver/respond';
      
      console.log(`Trying correct endpoint: ${correctEndpoint}`);
      const result = await makeApiCall(correctEndpoint, requestBody, 'PUT');
      
      if (result.success && result.data.success) {
        Alert.alert(
          'Success', 
          'Booking request accepted successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.navigate('DryCleaningDropoff', { 
                  bookingData: {
                    ...bookingDetails,
                    status: 'accepted'
                  }
                });
              }
            }
          ]
        );
      } else {
        throw new Error(result.error || 'Failed to accept booking');
      }

    } catch (error) {
      console.error('Accept booking error:', error);
      Alert.alert(
        'Connection Error', 
        `Failed to accept booking: ${error.message}\n\nPlease check:\n1. Server is running\n2. Correct API endpoint\n3. Network connection`,
        [
          {
            text: 'Retry',
            onPress: handleAcceptBooking
          },
          {
            text: 'Cancel',
            style: 'cancel'
          }
        ]
      );
    } finally {
      setIsAccepting(false);
    }
  };

  // Handle rejecting booking request - FIXED
  const handleRejectBooking = () => {
    Alert.alert(
      'Reject Booking',
      'Are you sure you want to reject this booking request?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsRejecting(true);
              
              const requestBody = {
                bookingId: bookingDetails.id,
                response: 'reject',
                rejectionReason: 'Driver declined the request'
              };

              // Use the CORRECT endpoint with PUT method
              const correctEndpoint = 'http://localhost:5000/api/users/driver/respond';
              
              console.log(`Trying correct endpoint: ${correctEndpoint}`);
              const result = await makeApiCall(correctEndpoint, requestBody, 'PUT');
              
              if (result.success && result.data.success) {
                Alert.alert(
                  'Booking Rejected', 
                  'The booking request has been rejected.',
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        navigation.navigate('LocateDryCleaning1');
                      }
                    }
                  ]
                );
              } else {
                throw new Error(result.error || 'Failed to reject booking');
              }

            } catch (error) {
              console.error('Reject booking error:', error);
              Alert.alert(
                'Connection Error', 
                `Failed to reject booking: ${error.message}\n\nPlease check:\n1. Server is running\n2. Correct API endpoint\n3. Network connection`
              );
            } finally {
              setIsRejecting(false);
            }
          }
        }
      ]
    );
  };

  // Add useEffect to log booking details on component mount
  useEffect(() => {
    console.log('DryCleaningPickup mounted with booking details:', bookingDetails);
    if (bookingDetails) {
      console.log('Booking ID:', bookingDetails.id);
      console.log('Booking Status:', bookingDetails.status);
    }
  }, [bookingDetails]);

  // If no booking details, show error
  if (!bookingDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pick Up Dry Cleaning</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No booking details found</Text>
          <TouchableOpacity 
            style={styles.backToLocatorButton}
            onPress={() => navigation.navigate('LocateDryCleaning1')}
          >
            <Text style={styles.backToLocatorText}>Back to Locator</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Map View */}
      <View style={styles.mapContainer}>
        <Image source={images.BookingConfirmationMap} style={styles.mapImage} />

        {/* Back button and title */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pick Up Dry Cleaning</Text>
        </View>

        {/* Map markers */}
        <View style={[styles.marker, {top: '20%', left: '15%'}]}>
          <Image source={images.man1} style={styles.markerIcon} />
        </View>

        <View style={[styles.marker, {top: '30%', left: '40%'}]}>
          <Image source={images.man1} style={styles.markerIcon} />
        </View>

        {/* Route and car */}
        <Image source={images.routepath} style={styles.routeImage} />

        {/* Map controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity style={styles.currentLocationButton}>
            <Image
              source={images.currentlocation1}
              style={styles.controlIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.expandButton}>
            <Image source={images.expand} style={styles.controlIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Bottom Card */}
      <View style={styles.bottomCard}>
        {/* Provider Info */}
        <View style={styles.detailsContainer}>
          <View style={styles.providerSection}>
            <View style={styles.providerIconContainer}>
              <Image 
                source={bookingDetails.icon === 'person' ? images.man2 : images.washing} 
                style={styles.providerIcon} 
              />
            </View>
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>{bookingDetails.name}</Text>
              <Text style={styles.orderNumber}>Order: {bookingDetails.orderNumber || bookingDetails.id}</Text>
              <Text style={[styles.status, { color: getStatusColor(bookingDetails.status) }]}>
                Status: {bookingDetails.status?.toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity onPress={() => {
              navigation.navigate('OrderDetailes', { bookingData: bookingDetails });
            }}>
              <Text style={styles.orderDetails}>Order Details</Text>
            </TouchableOpacity>
          </View>

         {/* Pickup and Dropoff */}
         <View style={styles.locationContainer}>
            {/* Pickup */}
            <View style={styles.locationRow}>
              <View style={styles.pickupDotContainer}>
                <View style={styles.greenDot} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationType}>Pickup</Text>
                <Text style={styles.locationAddress}>
                  {bookingDetails.pickup || '123, Lincon Street, New York'}
                </Text>
              </View>
            </View>

            {/* Connecting Line */}
            <View style={styles.locationLine} />

            {/* Dropoff */}
            <View style={styles.locationRow}>
              <View style={styles.dropoffDotContainer}>
                <View style={styles.orangeDot} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={styles.locationType}>Drop Off</Text>
                <Text style={styles.locationAddress}>
                  {bookingDetails.dropOff || '30 Lincoln St, New Rochelle, New York'}
                </Text>
              </View>
            </View>
          </View>

          {/* Trip Details */}
          <View style={styles.tripDetails}>
            <View style={styles.tripInfo}>
              <Image source={images.location2} style={styles.tripIcon} />
              <Text style={styles.tripText}>{bookingDetails.miles || '30 miles'}</Text>
            </View>
            <View style={styles.tripInfo}>
              <Image source={images.clock} style={styles.tripIcon2} />
              <Text style={styles.tripText}>{bookingDetails.time || '50 min'}</Text>
            </View>
            <Text style={styles.priceText}>{bookingDetails.price || '$22.30'}</Text>
          </View>

          {/* Cost Breakdown */}
          <View style={styles.costContainer}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Total Trip Cost</Text>
              <Text style={styles.costValue}>{bookingDetails.price || '$22.30'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Estimated Tip</Text>
              <Text style={styles.costValue}>$5.00</Text>
            </View>
          </View>
        </View>

        {/* Buttons - Show different buttons based on booking status */}
        <View style={styles.buttonContainer}>
          {bookingDetails.status === 'pending' || bookingDetails.status === 'requested' ? (
            <>
              {/* Accept Button */}
              <TouchableOpacity 
                style={[styles.acceptButton, isAccepting && styles.disabledButton]} 
                onPress={handleAcceptBooking}
                disabled={isAccepting || isRejecting}
              >
                {isAccepting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.acceptButtonText}>Accept</Text>
                )}
              </TouchableOpacity>
              
              {/* Reject Button */}
              <TouchableOpacity 
                style={[styles.rejectButton, isRejecting && styles.disabledButton]} 
                onPress={handleRejectBooking}
                disabled={isAccepting || isRejecting}
              >
                {isRejecting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.rejectButtonText}>Reject</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              {/* For accepted bookings */}
              <TouchableOpacity 
                style={styles.acceptButton} 
                onPress={() => {
                  navigation.navigate('DryCleaningDropoff', { bookingData: bookingDetails });
                }}
              >
                <Text style={styles.acceptButtonText}>Start Trip</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.newPickupButton} 
                onPress={() => {
                  navigation.navigate('LocateDryCleaning1');
                }}
              >
                <Text style={styles.newPickupButtonText}>New Pickup</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Helper function to get status color
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'accepted':
      return '#4CAF50';
    case 'pending':
    case 'requested':
      return '#FF8C00';
    case 'rejected':
      return '#FF0000';
    case 'completed':
      return '#2196F3';
    default:
      return '#666666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    marginTop: 80,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '500',
    color: '#000000',
    marginLeft: 8,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  routeImage: {
    position: 'absolute',
    width: '60%',
    height: '40%',
    resizeMode: 'contain',
    top: '30%',
    right: '10%',
  },
  mapControls: {
    position: 'absolute',
    top: 200,
    left: 290,
    gap: 20,
  },
  currentLocationButton: {
    width: 50,
    height: 50,
  },
  expandButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  controlIcon: {
    width: 110,
    height: 110,
    resizeMode: 'contain',
  },
  bottomCard: {
    position: 'absolute',
    bottom: -60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  detailsContainer: {
    backgroundColor: '#FFF5EB',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    height:'75%',
  },
  pickupDotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderColor: '#4CAF50',
  },
  dropoffDotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderColor: '#FF8C00',
  },
  providerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  providerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerIcon: {
    width: 20,
    height: 20,
    tintColor: '#FFFFFF',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
  },
  orderNumber: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 1,
  },
  orderDetails: {
    fontSize: 16,
    color: '#666666',
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  orangeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FF8C00',
  },
  locationLine: {
    width: 2,
    height: 30,
    backgroundColor: '#CCCCCC',
    marginLeft: 11,
    top:-10,
  },
  locationInfo: {
    flex: 1,
  },
  locationType: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  locationAddress: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripIcon: {
    width: 15,
    height: 20,
    tintColor: '#666666',
    marginRight: 5,
  },
  tripIcon2: {
    width: 19,
    height: 20,
    tintColor: '#666666',
    marginRight: 5,
  },
  tripText: {
    fontSize: 14,
    color: '#666666',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FF8C00',
  },
  costContainer: {
    marginBottom: 50,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  costLabel: {
    fontSize: 16,
    color: '#000000',
  },
  costValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    top: 10,
  },
  acceptButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#FF8C00',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  rejectButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#FF4444',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  newPickupButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#6B7280',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPickupButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  disabledButton: {
    opacity: 0.6,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 20,
  },
  backToLocatorButton: {
    backgroundColor: colors.brandColor,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  backToLocatorText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DryCleaningPickup;