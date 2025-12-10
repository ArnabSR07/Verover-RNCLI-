import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import { images } from '../../assets/images/images';
import colors from '../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';
const { width } = Dimensions.get('window');

const DriverPickupOrder = () => {
 const navigation = useNavigation<NavigationProps>();
  type NavigationProps = StackNavigationProp<RootStackParamList>;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Driver Pickup Order</Text>
            <Text style={styles.orderNumber}>#DC58223</Text>
          </View>
        </View>

        {/* Pickup Date & Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Date & Time</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateText}>November 02-2021</Text>
            <Text style={styles.timeText}>12.00 PM</Text>
          </View>
        </View>

        {/* Address Of Pickup */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Address Of Pickup</Text>
          <View style={styles.addressContainer}>
            <View style={styles.iconContainer}>
              <Image source={images.washing} style={styles.laundryIcon} />
            </View>
            <View style={styles.addressTextContainer}>
              <Text style={styles.businessName}>Mico Cleaners</Text>
              <Text style={styles.addressText}>123, Lincon Street, New York</Text>
            </View>
          </View>
        </View>

        {/* Pickup and Dropoff Locations */}
        <View style={styles.card}>
          <View style={styles.routeContainer}>
            {/* Pickup Location */}
            <View style={styles.locationRow}>
              <View style={styles.dotLineContainer}>
                <View style={styles.orangeCircle}>
                  <View style={styles.orangeDot} />
                </View>
                <View style={styles.verticalLine} />
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationType}>Pickup Location</Text>
                <Text style={styles.locationAddress}>123, Lincon Street, New York</Text>
              </View>
            </View>

            {/* Drop Off Location */}
            <View style={styles.locationRow}>
              <View style={styles.dotLineContainer}>
                <View style={styles.grayCircle}>
                  <View style={styles.grayDot} />
                </View>
              </View>
              <View style={styles.locationTextContainer}>
                <Text style={styles.locationType}>Drop Off Location</Text>
                <Text style={styles.businessName}>Mo's Dry Cleaners</Text>
                <Text style={styles.locationAddress}>30 Lincoln St, New Rochelle, New York</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.pickupButton}>
          <Text style={styles.pickupButtonText}>Pick Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* List Of Items */}
        <View style={styles.itemsSection}>
          <View style={styles.itemsHeader}>
            <Text style={styles.itemsTitle}>List Of Items</Text>
            <TouchableOpacity style={styles.callButton}>
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>

          {/* Item 1 */}
          <View style={styles.itemCard}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>T-Shirt</Text>
              <Text style={styles.itemType}>Wash Only</Text>
              <Text style={styles.itemPrice}>$10.00</Text>
            </View>
            <Text style={styles.itemQuantity}>2</Text>
          </View>

          {/* Item 2 */}
          <View style={styles.itemCard}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>Shirt</Text>
              <Text style={styles.itemType}>Wash & Fold</Text>
              <Text style={styles.itemPrice}>$30.00</Text>
            </View>
            <Text style={styles.itemQuantity}>3</Text>
          </View>

          {/* Item 3 */}
          <View style={styles.itemCard}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>Jacket</Text>
              <Text style={styles.itemType}>Wash Only</Text>
              <Text style={styles.itemPrice}>$25.00</Text>
            </View>
            <Text style={styles.itemQuantity}>1</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 80,
  },
  backButton: {
    marginRight: 15,
    top: -10,
    flexDirection: 'row',
  },
  backArrow: {
    fontSize: 24,
    color: '#FF9933',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    flexDirection: 'row',
  },
  orderNumber: {
    fontSize: 14,
    color: '#FF9933',
    top: -20,
    textAlign: 'right',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#FF9933',
    fontWeight: '500',
    marginBottom: 10,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
  },
  timeText: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginHorizontal: 15,
    marginTop: 15,
  },
  cardTitle: {
    fontSize: 18,
    color: '#000000',
    fontWeight:'500',
    marginBottom: 15,

  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#F99026',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  laundryIcon: {
    width: 20,
    height: 23,
    borderRadius: 3,
  },
  addressTextContainer: {
    flex: 1,
  },
  businessName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#808080',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#808080',
    fontWeight: '500',
  },
  routeContainer: {
    paddingVertical: 5,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  dotLineContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 15,
  },
  orangeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F99026',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orangeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#F99026',
  },
  grayCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#5E5E60',
    justifyContent: 'center',
    alignItems: 'center',
  },
  grayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#888',
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: '#ddd',
    marginTop: 5,
    marginBottom: -5,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationType: {
    fontSize: 14,
    color: '#000000',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 14,
    color: '#666',
  },
  pickupButton: {
    backgroundColor: '#F99026',
    borderRadius: 30,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#FF9933',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  pickupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#A2A2A2',
    borderRadius: 30,
    paddingVertical: 15,
    marginHorizontal: 15,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsSection: {
    marginTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemsTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
  callButton: {
    backgroundColor: '#555',
    paddingHorizontal: 23,
    paddingVertical: 8,
    borderRadius: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  itemDetails: {
    flex: 1,
    gap:8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    color: '#666',
  },
  itemQuantity: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    marginHorizontal: 15,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF9933',
  },
});

export default DriverPickupOrder;
