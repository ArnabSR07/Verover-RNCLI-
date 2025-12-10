import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import { images } from '../../assets/images/images';
import colors from '../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';

const SessionSummaryScreen = () => {
 const navigation = useNavigation<NavigationProps>();
  type NavigationProps = StackNavigationProp<RootStackParamList>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Back button and Title */}
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>Your Session Summary</Text>
            <Text style={styles.rideIdText}>#RIDSR58223</Text>
          </View>
        </View>

        {/* Pickup Total Section */}
        <View style={styles.pickupTotalContainer}>
          <Text style={styles.pickupTotalLabel}>Pickup Total</Text>
          <Text style={styles.pickupTotalAmount}>$22.30</Text>
          <Text style={styles.pickupDateTime}>28 MAY 2021, 2:00 PM</Text>
          <View style={styles.divider} />
        </View>

        {/* Driver Info Section */}
        <View style={styles.driverInfoContainer}>
          <View style={styles.driverIconContainer}>
            <Image source={images.man2} style={styles.driverIcon} />
          </View>
          <Text style={styles.driverName}>Jason Anderson</Text>
        </View>

        {/* Pickup and Dropoff Section */}
        <View style={styles.locationContainer}>
          {/* Pickup */}
          <View style={styles.locationRow}>
            <View style={styles.locationDotContainer}>
              <View style={styles.greenCircle}>
                <View style={styles.greenDot} />
              </View>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationType}>Pickup</Text>
              <Text style={styles.locationAddress}>123, Lincon Street, New York</Text>
            </View>
          </View>

          {/* Vertical line connecting dots */}
          <View style={styles.verticalLine} />

          {/* Dropoff */}
          <View style={styles.locationRow}>
            <View style={styles.locationDotContainer}>
              <View style={styles.greenCircle}>
                <View style={styles.greenDot} />
              </View>
            </View>
            <View style={styles.locationTextContainer}>
              <Text style={styles.locationType}>Drop Off</Text>
              <Text style={styles.locationAddress}>30 Lincoln St, New Rochelle, New York</Text>
            </View>
          </View>
        </View>

        {/* Trip Details */}
        <View style={styles.tripDetailsContainer}>
          <View style={styles.tripDetailItem}>
            <Image source={images.location2} style={styles.tripDetailIcon} />
            <Text style={styles.tripDetailText}>30 miles</Text>
          </View>
          <View style={styles.tripDetailItem}>
            <Image source={images.clock} style={styles.tripDetailIcon2} />
            <Text style={styles.tripDetailText}>50 min</Text>
          </View>
          <Text style={styles.tripDetailPrice}>$22.30</Text>
        </View>

        {/* Payment Summary Section */}
        <View style={styles.paymentSummaryContainer}>
          <Text style={styles.paymentSummaryTitle}>Payment Summary</Text>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Started At</Text>
            <Text style={styles.paymentValue}>26 MAY 2021, 10:00 AM</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>End At</Text>
            <Text style={styles.paymentValue}>26 MAY 2021, 11:50 AM</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Time Used</Text>
            <Text style={styles.paymentValue}>50 Minutes</Text>
          </View>

          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>Driver Tip</Text>
            <Text style={styles.paymentValue}>$15.00</Text>
          </View>

          <View style={styles.totalPaymentRow}>
            <Text style={styles.totalPaymentLabel}>Total Payment <Text style={styles.approxText}>(ᵏApprox)</Text></Text>
            <Text style={styles.totalPaymentValue}>$10.00</Text>
          </View>
        </View>

        {/* New Pickup Button */}
        <TouchableOpacity style={styles.newPickupButton}>
          <Text style={styles.newPickupButtonText}>New Pickup</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 90,
    paddingBottom: 10,
    left: -15,
  },
  backButton: {
    padding: 5,
  },
  backArrowIcon: {
    width: 24,
    height: 24,
    tintColor: '#FF8C00',
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 1,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
  rideIdText: {
    fontSize: 16,
    color: '#FF8C00',
    left: 10,
  },
  pickupTotalContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pickupTotalLabel: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
  },
  pickupTotalAmount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 10,
  },
  pickupDateTime: {
    fontSize: 16,
    color: '#000',
    marginBottom: 15,
  },
  divider: {
    width: '90%',
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  driverInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  driverIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverIcon: {
    width: 25,
    height: 25,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
  locationContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationDotContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  verticalLine: {
    width: 2,
    height: 35,
    backgroundColor: '#E0E0E0',
    marginLeft: 14,
    marginBottom: 10,
  },
  locationTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  locationType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  locationAddress: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  tripDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
  },
  tripDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDetailIcon: {
    width: 20,
    height: 28,
    marginRight: 5,
    tintColor: '#757575',
  },
  tripDetailIcon2: {
    width: 20,
    height: 20,
    marginRight: 5,
    tintColor: '#757575',
  },
  tripDetailText: {
    fontSize: 14,
    color: '#757575',
  },
  tripDetailPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  paymentSummaryContainer: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  paymentSummaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  paymentLabel: {
    fontSize: 16,
    color: '#000',
  },
  paymentValue: {
    fontSize: 16,
    color: '#000',
    textAlign: 'right',
  },
  totalPaymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  totalPaymentLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  approxText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  totalPaymentValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  newPickupButton: {
    backgroundColor: '#808080',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 40,
    width: '70%',
  },
  newPickupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SessionSummaryScreen;
