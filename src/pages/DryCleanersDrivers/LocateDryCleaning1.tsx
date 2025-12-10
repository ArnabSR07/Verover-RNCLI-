import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-paper/src/components/Icon';
import { images } from '../../assets/images/images';
import colors from '../../assets/color';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';
const { width, height } = Dimensions.get('window');

const DryCleaningLocator = () => {
  const navigation = useNavigation<NavigationProps>();
  type NavigationProps = StackNavigationProp<RootStackParamList>;
  const [isExpanded, setIsExpanded] = useState(false);
  const [serviceProviders, setServiceProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [driverStatus, setDriverStatus] = useState(null);

  // Token - Replace with your actual token retrieval method
  const getAuthToken = () => {
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODk5ODBiNzg5Njk5ODM0M2UwZTRkOGQiLCJ1c2VyVHlwZSI6ImRyaXZlciIsImlhdCI6MTc1NzQ5ODE1MSwiZXhwIjoxNzYwMDkwMTUxfQ.fQ2dcfh7SHSWDLnDYRU2Sp8zLOQ4LAo5ps6H9uqklsQ";
  };

  // Fetch driver requests from API
  const fetchDriverRequests = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/users/driver/requests', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        // Set driver status
        if (data.data.driverStatus) {
          setDriverStatus(data.data.driverStatus);
        }

        // Transform the API data to match your component's expected format
        if (data.data.bookings && Array.isArray(data.data.bookings)) {
          const transformedProviders = data.data.bookings.map((booking, index) => ({
            id: booking._id,
            name: booking.dryCleaner?.shopname || booking.dryCleaner?.name || `Provider ${index + 1}`,
            icon: 'laundry', // Default to laundry icon for dry cleaners
            pickup: booking.pickupAddress || 'Pickup address not specified',
            dropOff: booking.dropoffAddress || 'Drop-off address not specified',
            miles: `${booking.distance || 0} miles`,
            time: `${booking.time || booking.estimatedTime || 0} min`,
            price: `$${(booking.price || 0).toFixed(2)}`,
            status: booking.status,
            orderNumber: booking.orderNumber,
            trackingId: booking.Tracking_ID || booking.trackingId,
            user: {
              id: booking.user?._id || booking.user?.id,
              name: booking.user?.fullName || booking.user?.name,
              phone: booking.user?.phoneNumber || booking.user?.phone,
              email: booking.user?.email
            },
            dryCleaner: {
              id: booking.dryCleaner?._id || booking.dryCleaner?.id,
              name: booking.dryCleaner?.shopname || booking.dryCleaner?.name,
              address: booking.dryCleaner?.address,
              phone: booking.dryCleaner?.phoneNumber || booking.dryCleaner?.phone
            },
            scheduledPickup: booking.scheduledPickupDateTime,
            scheduledDelivery: booking.scheduledDeliveryDateTime,
            createdAt: booking.createdAt,
            isScheduled: booking.isScheduled,
            priority: booking.priority || 'normal'
          }));
          
          setServiceProviders(transformedProviders);
        } else {
          setServiceProviders([]);
        }
      } else {
        throw new Error(data.message || 'Invalid response format');
      }
    } catch (err) {
      console.error('Error fetching driver requests:', err);
      setError(err.message);
      
      if (!isRefresh) {
        Alert.alert('Error', 'Failed to load service providers. Please try again.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh function for pull-to-refresh
  const onRefresh = useCallback(() => {
    fetchDriverRequests(true);
  }, []);

  // Fetch data when component mounts and when screen comes into focus
  useEffect(() => {
    fetchDriverRequests();
  }, []);

  // Refresh when screen comes back into focus
  useFocusEffect(
    useCallback(() => {
      // Only refresh if we have existing data (to avoid double loading on first mount)
      if (serviceProviders.length > 0 || driverStatus) {
        fetchDriverRequests(true);
      }
    }, [serviceProviders.length, driverStatus])
  );

  // Auto-refresh every 30 seconds when app is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !refreshing) {
        fetchDriverRequests(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, refreshing]);

  // Retry function
  const handleRetry = () => {
    fetchDriverRequests();
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Enhanced provider press handler
  const handleProviderPress = (provider) => {
    // Validate provider data before navigation
    if (!provider || !provider.id) {
      Alert.alert('Error', 'Invalid booking data. Please try again.');
      return;
    }

    // Check if booking is still pending
    if (provider.status !== 'pending' && provider.status !== 'requested') {
      Alert.alert(
        'Booking Unavailable', 
        `This booking is ${provider.status}. Only pending bookings can be accepted.`
      );
      return;
    }

    console.log('Navigating to pickup screen with provider:', {
      id: provider.id,
      name: provider.name,
      status: provider.status
    });
    
    // Navigate to DryCleaningPickup with complete provider data
    navigation.navigate('DryCleaningPickup', { 
      providerData: {
        ...provider,
        navigationTimestamp: new Date().toISOString(),
        sourceScreen: 'DryCleaningLocator'
      }
    });
  };

  // Handle booking status updates
  const handleBookingStatusUpdate = (bookingId, newStatus) => {
    setServiceProviders(prevProviders => {
      const updatedProviders = prevProviders.map(provider => 
        provider.id === bookingId 
          ? { ...provider, status: newStatus }
          : provider
      );

      // If booking was accepted/rejected, remove it from the list after a short delay
      if (newStatus === 'accepted' || newStatus === 'rejected') {
        setTimeout(() => {
          setServiceProviders(current => 
            current.filter(provider => provider.id !== bookingId)
          );
        }, 2000);
      }

      return updatedProviders;
    });
  };

  // Get status color helper
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
      case 'in_progress':
        return '#9C27B0';
      default:
        return '#666666';
    }
  };

  // Render individual provider card
  const renderProviderCard = (provider) => (
    <TouchableOpacity
      key={provider.id}
      style={[
        styles.providerCard,
        provider.priority === 'high' && styles.highPriorityCard,
        provider.status !== 'pending' && provider.status !== 'requested' && styles.unavailableCard
      ]}
      onPress={() => handleProviderPress(provider)}
      activeOpacity={0.7}
      disabled={provider.status !== 'pending' && provider.status !== 'requested'}
    >
      <View style={styles.providerHeader}>
        <View style={styles.providerIconContainer}>
          <Image
            source={provider.icon === 'person' ? images.man2 : images.washing}
            style={styles.providerIcon}
          />
        </View>
        <View style={styles.providerNameContainer}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.orderNumber}>Order: {provider.orderNumber}</Text>
          <View style={styles.statusContainer}>
            <Text style={[styles.status, { color: getStatusColor(provider.status) }]}>
              {provider.status?.toUpperCase()}
            </Text>
            {provider.priority === 'high' && (
              <View style={styles.priorityBadge}>
                <Text style={styles.priorityText}>HIGH PRIORITY</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.cardActions}>
          <Text style={styles.tapToView}>
            {provider.status === 'pending' || provider.status === 'requested' ? 'Tap to view' : 'Unavailable'}
          </Text>
          <Icon source="chevron-right" size={16} color="#666666" />
        </View>
      </View>

      {/* Customer Info */}
      {provider.user?.name && (
        <View style={styles.customerInfo}>
          <Icon source="account" size={14} color="#666666" />
          <Text style={styles.customerName}>{provider.user.name}</Text>
        </View>
      )}

      <View style={styles.locationContainer}>
        <View style={styles.locationRow}>
          <View style={styles.locationDot}>
            <View style={styles.greenDot} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationType}>Pickup</Text>
            <Text style={styles.locationAddress} numberOfLines={2}>
              {provider.pickup}
            </Text>
          </View>
        </View>

        <View style={styles.locationLine} />

        <View style={styles.locationRow}>
          <View style={styles.locationDot1}>
            <View style={styles.orangeDot} />
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationType}>Drop Off</Text>
            <Text style={styles.locationAddress} numberOfLines={2}>
              {provider.dropOff}
            </Text>
          </View>
        </View>
      </View>

      {/* Scheduled Time Info */}
      {provider.scheduledPickup && (
        <View style={styles.scheduledInfo}>
          <Icon source="clock-outline" size={14} color="#FF8C00" />
          <Text style={styles.scheduledText}>
            Scheduled: {new Date(provider.scheduledPickup).toLocaleString()}
          </Text>
        </View>
      )}

      <View style={styles.tripDetails}>
        <View style={styles.tripInfo}>
          <Image source={images.location2} style={styles.tripIcon} />
          <Text style={styles.tripText}>{provider.miles}</Text>
        </View>
        <View style={styles.tripInfo}>
          <Image source={images.clock} style={styles.tripIcon1} />
          <Text style={styles.tripText}>{provider.time}</Text>
        </View>
        <Text style={styles.priceText}>{provider.price}</Text>
      </View>
    </TouchableOpacity>
  );

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Locate Dry Cleaning</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandColor} />
          <Text style={styles.loadingText}>Loading service providers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error && serviceProviders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Locate Dry Cleaning</Text>
        </View>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Failed to load service providers</Text>
          <Text style={styles.errorSubText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.brandColor]}
            tintColor={colors.brandColor}
          />
        }
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Locate Dry Cleaning</Text>
          
          {/* Refresh button */}
          <TouchableOpacity style={styles.refreshButton} onPress={handleRetry}>
            <Icon source="refresh" size={24} color={colors.brandColor} />
          </TouchableOpacity>
        </View>

        {/* Driver Status Info */}
        {driverStatus && (
          <View style={styles.driverStatusContainer}>
            <View style={[
              styles.statusIndicator, 
              { backgroundColor: driverStatus.isBooked ? '#FF8C00' : '#4CAF50' }
            ]} />
            <Text style={styles.driverStatusText}>
              {driverStatus.isBooked ? 'Currently Booked' : 'Available for bookings'}
            </Text>
            {driverStatus.currentBookingId && (
              <Text style={styles.currentBookingText}>
                Current Booking ID: {driverStatus.currentBookingId}
              </Text>
            )}
          </View>
        )}

        {/* Map section */}
        <View style={[styles.mapContainer, { height: isExpanded ? height : 400 }]}>
          <Image source={images.BookingConfirmationMap} style={styles.mapImage} />

          {/* Dynamic map markers based on fetched data */}
          {serviceProviders.slice(0, 6).map((provider, index) => {
            // Position markers dynamically (you can improve this logic)
            const positions = [
              { top: '20%', left: '10%' },
              { top: '10%', left: '80%' },
              { top: '50%', left: '20%' },
              { top: '80%', left: '10%' },
              { top: '50%', left: '70%' },
              { top: '75%', left: '45%' },
            ];
            
            return (
              <View key={provider.id} style={[styles.marker, positions[index]]}>
                <View style={styles.markerCircle}>
                  <Image 
                    source={provider.icon === 'person' ? images.man1 : images.washing2} 
                    style={styles.markerIcon} 
                  />
                </View>
              </View>
            );
          })}

          {/* User location and route (static for now) */}
          <View style={[styles.newImageContainer, { top: '40%', left: '35%' }]}>
            <Image source={images.userlocate} style={styles.newImage} />
            <Image source={images.route1} style={styles.newImage1} />
            <Image source={images.CarTop} style={styles.newImage2} />
          </View>

          {/* Map controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity>
              <Image source={images.currentlocation1} style={styles.controlIcon1} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleExpand}>
              <Image source={images.expand} style={styles.controlIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Service providers list */}
        {!isExpanded && (
          <View style={styles.whitesection}>
            <Image source={images.bar1} style={styles.bar} />
            
            {/* Show count of available providers */}
            <View style={styles.countContainer}>
              <Text style={styles.countText}>
                {serviceProviders.length} service provider{serviceProviders.length !== 1 ? 's' : ''} available
              </Text>
              {refreshing && (
                <ActivityIndicator size="small" color={colors.brandColor} style={styles.refreshIndicator} />
              )}
            </View>

            <View style={styles.providersContainer}>
              {serviceProviders.length === 0 ? (
                <View style={styles.noProvidersContainer}>
                  <Icon source="car-off" size={48} color="#CCCCCC" />
                  <Text style={styles.noProvidersText}>No service providers available at the moment</Text>
                  <Text style={styles.noProvidersSubText}>
                    {driverStatus?.message || "Pull down to refresh or try again later"}
                  </Text>
                </View>
              ) : (
                serviceProviders.map((provider) => renderProviderCard(provider))
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Updated styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 70,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    marginLeft: 3,
    color: '#000000',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  driverStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#F8F9FA',
    marginTop: 100,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  driverStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  currentBookingText: {
    fontSize: 12,
    color: '#666666',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF0000',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  errorSubText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: colors.brandColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  mapContainer: {
    width: '100%',
    position: 'relative',
    // marginTop: driverStatus ? 70 : 70,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerCircle: {
  },
  markerIcon: {
    width: 35,
    height: 40,
    borderRadius: 3,
  },
  newImageContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  newImage: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
  },
  newImage1: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    top:-121,
    left:50,
  },
  newImage2: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    top:-226,
    left:115,
  },
  mapControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    alignItems: 'center',
  },
  controlIcon: {
    width: 110,
    height: 110,
    top: 30,
    left: 20,
  },
  controlIcon1: {
    width: 110,
    height: 110,
    top: 60,
    left: 20,
  },
  providersContainer: {
    flex: 1,
    paddingHorizontal: 19,
    marginTop: 5,
  },
  whitesection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 16,
    marginTop: -10,
  },
  bar: {
    borderRadius: 20,
    height: 5,
    width: 60,
    alignSelf: 'center',
  },
  countContainer: {
    paddingHorizontal: 19,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  refreshIndicator: {
    marginLeft: 8,
  },
  noProvidersContainer: {
    padding: 40,
    alignItems: 'center',
  },
  noProvidersText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  noProvidersSubText: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  providerCard: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  highPriorityCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FF0000',
  },
  unavailableCard: {
    opacity: 0.6,
    backgroundColor: '#F0F0F0',
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },
  providerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  providerIcon: {
    width: 20,
    height: 23,
    tintColor: '#FFFFFF',
    borderRadius: 4,
  },
  providerNameContainer: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  orderNumber: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 1,
  },
  status: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  priorityBadge: {
    backgroundColor: '#FF0000',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  cardActions: {
    alignItems: 'flex-end',
  },
  tapToView: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 2,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 4,
  },
  customerName: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  locationContainer: {
    marginLeft: 8,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  locationDot: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#58B466',
  },
  locationDot1: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F99026',
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
    height: 35,
    backgroundColor: '#CCCCCC',
    marginLeft: 11,
    top: -10,
  },
  locationInfo: {
    marginLeft: 8,
    flex: 1,
  },
  locationType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  locationAddress: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  scheduledInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingLeft: 4,
  },
  scheduledText: {
    fontSize: 12,
    color: '#FF8C00',
    marginLeft: 4,
    fontWeight: '500',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripIcon: {
    width: 12,
    height: 18,
    tintColor: '#666666',
    left:15,
  },
  tripIcon1: {
    width: 18,
    height: 18,
    tintColor: '#666666',
    left:20,
  },
  tripText: {
    fontSize: 12,
    color: '#666666',
    left:30,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
  },
});

export default DryCleaningLocator;