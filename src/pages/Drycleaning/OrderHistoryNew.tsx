import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
  Platform,
  Dimensions,
} from 'react-native';
import {images} from '../../assets/images/images';
import Icon from 'react-native-paper/src/components/Icon';
import {NavigationProp} from '@react-navigation/native';

// Get device dimensions
const {width, height} = Dimensions.get('window');

type RootStackParamList = {
  TrackOrder: undefined;
};

interface TrackOrderProps {
  navigation: NavigationProp<RootStackParamList>;
}

export default function TrackOrder({navigation}: TrackOrderProps) {
  const handleCall = () => {
    Linking.openURL('tel:+11048285215');
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon source="arrow-left" size={35} color="#FF8C00" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Track Order</Text>
          <Text style={styles.orderId}>#DC58223</Text>
        </View>

        <View style={styles.mapContainer}>
          <Image
            source={images.BookingConfirmationMap}
            style={styles.mapImage}
          />
          <View>
          <Image
            source={images.cleanerimg}
            style={styles.cleanerImage}
          />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.dateSection}>
            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>Pickup Date & Time</Text>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.date}>November 02-2021</Text>
                <Text style={styles.time}>12.00 PM</Text>
              </View>
            </View>

            <View style={styles.dateBlock}>
              <Text style={styles.dateLabel}>Delivery Date & Time</Text>
              <View style={styles.dateTimeContainer}>
                <Text style={styles.date}>November 05-2021</Text>
                <Text style={styles.time}>02.00 PM</Text>
              </View>
            </View>
          </View>

          <Text style={[styles.dateLabel, styles.addressLabel]}>
            Pickup and Delivery Address
          </Text>

          <View style={styles.addressContainer}>
            {/* Pickup Location */}
            <View style={styles.addressBlock}>
              <View style={styles.dotLineContainer}>
                <View style={styles.outerCircle}>
                  <View style={styles.greenDot} />
                </View>
                <View style={styles.verticalLine} />
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressStatus}>
                  Pickup - Order Has been Picked Up
                </Text>
                <Text style={styles.address}>123, Lincon Street, New York</Text>
              </View>
            </View>

            {/* Drop-Off Location */}
            <View style={styles.addressBlock}>
              <View style={styles.dotLineContainer}>
                <View style={[styles.outerCircle, {borderColor: '#4CAF50'}]}>
                  <View style={styles.orangeDot} />
                </View>
              </View>
              <View style={styles.addressContent}>
                <Text style={styles.addressStatus}>
                  Drop Off - Drop Off in Progress
                </Text>
                <Text style={styles.address}>
                  30 Lincoln St, New Rochelle, New York
                </Text>
              </View>
            </View>
          </View>

          <Text style={[styles.dateLabel, styles.driverLabel]}>
            Delivery Boy Information
          </Text>

          <View style={styles.driverContainer}>
            <View style={styles.driverInfo}>
              <Image source={images.contactImage} style={styles.driverImage} />
              <View style={styles.driverDetails}>
                <Text style={styles.driverName}>Jason Anderson</Text>
                <Image source={images.dialer} style={styles.dialerIcon} />
                <Text style={styles.driverPhone}>+1 1048285215</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Text style={styles.callButtonText}>Call</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.dateLabel, styles.itemsLabel]}>
            List Of Items
          </Text>
          <View style={styles.itemsSection}>
            {[
              {name: 'T-Shirt', service: 'Wash Only', price: 10.0, quantity: 2},
              {name: 'Shirt', service: 'Wash & Fold', price: 30.0, quantity: 3},
              {name: 'Jacket', service: 'Wash Only', price: 25.0, quantity: 1},
            ].map((item, index) => (
              <View key={index} style={styles.itemCard}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemService}>{item.service}</Text>
                  <Text style={styles.itemPrice}>$20</Text>
                </View>
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
              </View>
            ))}
          </View>
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total</Text>
              <Text style={styles.summaryValue}>$15</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Fees</Text>
              <Text style={styles.summaryValue}>$30</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payment (*Approx)</Text>
              <Text style={styles.totalValue}>$45</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F7FA',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 86,
    paddingBottom: 6,
  },
  backButton: {
    padding:6,
    right:5,
  },
  backArrowIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 3,
    color: '#000000',
  },
  orderId: {
    marginLeft: 'auto',
    color: '#FF8A00',
    fontSize: 14,
  },
  mapContainer: {
    width: '100%',
    height: 200,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cleanerImage:{
    height: '100%',
    width: '67%',
    bottom: '100%',
    left: '20%',
  },
  contentContainer: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
  },
  dateBlock: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    color: '#FF8A00',
    marginBottom: 8,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 15,
    color: '#333',
  },
  time: {
    fontSize: 15,
    color: '#333',
  },
  addressLabel: {
    marginBottom: 16,
  },
  addressContainer: {
    padding: 3,
  },
  addressBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dotLineContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
  },
  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  orangeDot: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: '#DDDDDE',
  },
  addressContent: {
    marginLeft:2,
    flex: 1,
  },
  addressStatus: {
    fontSize: 14,
    fontWeight: '400',
    color: '#333',
    top:-10,
  },
  address: {
    fontSize: 12,
    color: '#666',
  },
  driverLabel: {
    marginBottom: 16,
  },
  driverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    elevation: 1,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  driverImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  driverDetails: {
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
    color: '#000',
  },
  driverPhone: {
    fontSize: 14,
    color: '#666',
    left: 20,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 6,
  },
  dialerIcon: {
    width: 16,
    height: 16,
    top: 18,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  itemsSection: {
    padding: 1,
    marginTop: 10,
  },
  itemsLabel: {
    marginBottom: 16,
  },
  itemsList: {
    marginBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
    color: '#000000',
  },
  itemService: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  itemInstruction: {
    fontSize: 14,
    color: '#666',
  },
  itemPriceContainer: {
    alignItems: 'flex-end',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000000',
  },
  itemPrice: {
    fontSize: 14,
    color: '#FF8A00',
  },
  summary: {
    backgroundColor: '#FFFFFF',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 38 : 17,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    width: width * 0.97,
    height: height * 0.22,
    alignSelf: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '400',
    color: '#F99026',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#F99026',
  },
});
