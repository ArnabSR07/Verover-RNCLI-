import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import {images} from '../../assets/images/images';
import colors from '../../assets/color';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';
const {width, height} = Dimensions.get('window');

const DryCleaningPickup = () => {
 const navigation = useNavigation<NavigationProps>();
  type NavigationProps = StackNavigationProp<RootStackParamList>;
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
          <Text style={styles.headerTitle}>Order Drop Off</Text>
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
              <Image source={images.man2} style={styles.providerIcon} />
            </View>
            <Text style={styles.providerName}>Jason Anderson</Text>
            <TouchableOpacity  onPress={() => {
                    navigation.navigate('OrderDetailes');
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
                  123, Lincon Street, New York
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
                  30 Lincoln St, New Rochelle, New York
                </Text>
              </View>
            </View>
          </View>

          {/* Trip Details */}
          <View style={styles.tripDetails}>
            <View style={styles.tripInfo}>
              <Image source={images.location2} style={styles.tripIcon} />
              <Text style={styles.tripText}>30 miles</Text>
            </View>
            <View style={styles.tripInfo}>
              <Image source={images.clock} style={styles.tripIcon2} />
              <Text style={styles.tripText}>50 min</Text>
            </View>
            <Text style={styles.priceText}>$22.30</Text>
          </View>

          {/* Cost Breakdown */}
          <View style={styles.costContainer}>
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Total Trip Cost</Text>
              <Text style={styles.costValue}>$22.30</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Tip</Text>
              <Text style={styles.costValue}>$18.00</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.acceptButton} onPress={() => {
                    navigation.navigate('PickupSuccessfulPopup');
                }}>
            <Text style={styles.acceptButtonText}>Confirm Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newPickupButton} onPress={() => {
                    navigation.navigate('WaitingForPickup');
                }} >
            <Text style={styles.newPickupButtonText}>Cancel Pickup</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
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
    marginLeft: 1,
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
    marginRight: 1,
    left:-10,
  },
  providerIcon: {
    width: 20,
    height: 20,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000000',
    flex: 1,
  },
  orderDetails: {
    fontSize: 16,
    color: '#666666',
    left:10,
  },
  locationContainer: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  locationDotContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
      borderColor: '#FF8C00',
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
    top:10,
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
    fontSize: 16,
    fontWeight: 'bold',
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default DryCleaningPickup;
