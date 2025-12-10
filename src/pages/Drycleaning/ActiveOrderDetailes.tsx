import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import {type NavigationProp, useNavigation} from '@react-navigation/native';
import Icon from 'react-native-paper/src/components/Icon';
import {images} from '../../assets/images/images';
import OrderDetailsBottom from '../../components/OrderDetailsBottom';

type RootStackParamList = {
  ActiveOrderDetails: undefined;
  TrackLiveOrder: undefined;
};

const CLEANER_PHONE = '+1234567890';

export default function ActiveOrderDetails() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedPickupAddress, setSelectedPickupAddress] = useState(
    '123, Lincon Street, New York',
  );
  const [selectedDeliveryAddress, setSelectedDeliveryAddress] = useState(
    '30 Lincoln St, New Rochelle, New York',
  );

  const handleCall = () => {
    Linking.openURL(`tel:${CLEANER_PHONE}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}>
              <Icon source="arrow-left" size={35} color="#FF8C00" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Active Order Details</Text>
          </View>

          {/* Order Details */}
          <View style={styles.orderDetailsContainer}>
            <View>
              <Text style={styles.sectionTitle}>Order Details</Text>
              <Text style={styles.sectionTitle1}>Order Number</Text>
              <Text style={styles.orderNumber}>#DC58223</Text>
              <Text style={styles.orderStatus}>Order Confirmed</Text>
            </View>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() => navigation.navigate('TrackLiveOrder')}>
              <View style={styles.trackButtonContent}>
                <Image source={images.myLocation} style={styles.trackIcon} />
                <Text style={styles.trackButtonText}>TRACK ACTIVE ORDER</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Dates */}
          <View style={styles.dateSection}>
            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Pickup Date & Time</Text>
              <View style={styles.dateRow}>
                <Text style={styles.date}>November 02-2021</Text>
                <Text style={styles.time}>12:00 PM</Text>
              </View>
            </View>

            <View style={styles.dateContainer}>
              <Text style={styles.dateLabel}>Delivery Date & Time</Text>
              <View style={styles.dateRow}>
                <Text style={styles.date}>November 05-2021</Text>
                <Text style={styles.time}>02:00 PM</Text>
              </View>
            </View>
          </View>

          {/* Addresses */}
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Pickup and Delivery Address</Text>

            <View style={styles.addressContainer}>
              <View style={styles.progressLine}>
                <View style={styles.dotContainer1}>
                  <View style={styles.dot1} />
                </View>
                <View style={styles.line} />
                <View style={styles.dotContainer2}>
                  <View style={styles.dot2} />
                </View>
              </View>

              <View style={styles.addresses}>
                {/* Pickup Address Block */}
                <View style={styles.addressBlock}>
                  <View style={styles.addressHeader}>
                    <View style={styles.addressInfo}>
                      <Text style={styles.addressType}>
                        Pickup - Order Has been Picked Up
                      </Text>
                      <Text style={styles.address}>{selectedPickupAddress}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.changeButton}
                      onPress={() => setShowPickupModal(true)}>
                      <View style={styles.changeButtonContent}>
                        <Image source={images.pen} style={styles.changeIcon} />
                        <Text style={styles.changeButtonText}>CHANGE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Delivery Address Block */}
                <View style={styles.addressBlock}>
                  <View style={styles.addressHeader}>
                    <View style={styles.addressInfo}>
                      <Text style={styles.addressType}>
                        Drop Off - Drop Off in Progress
                      </Text>
                      <Text style={styles.address}>{selectedDeliveryAddress}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.changeButton}
                      onPress={() => setShowDeliveryModal(true)}>
                      <View style={styles.changeButtonContent}>
                        <Image source={images.pen} style={styles.changeIcon} />
                        <Text style={styles.changeButtonText}>CHANGE</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>


        <OrderDetailsBottom
          selectedPickupAddress={selectedPickupAddress}
          selectedDeliveryAddress={selectedDeliveryAddress}
          showPickupModal={showPickupModal}
          showDeliveryModal={showDeliveryModal}
          setShowPickupModal={setShowPickupModal}
          setShowDeliveryModal={setShowDeliveryModal}
          setSelectedPickupAddress={setSelectedPickupAddress}
          setSelectedDeliveryAddress={setSelectedDeliveryAddress}
          handleCall={handleCall}
        />

       </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 70,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
  },
  orderDetailsContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#F99026',
    marginBottom: 15,
    top: -10,
  },
  sectionTitle1: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000',
    left: 150,
    top: -30,
  },
  orderStatus: {
    color: '#FF9B50',
    fontSize: 16,
  },
  trackButton: {
    backgroundColor: '#FFF5EC',
    padding: 10,
    borderRadius: 8,
    top: -19,
  },
  trackIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  trackButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackButtonText: {
    color: '#FF9B50',
    fontWeight: '400',
  },
  dateSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  dateContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    color: '#FF9B50',
    marginBottom: 4,
    fontSize: 16,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 16,
    color: '#707070',
  },
  time: {
    fontSize: 16,
    color: '#666',
  },
  addressSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  addressContainer: {
    marginTop: 16,
  },
  progressLine: {
    position: 'absolute',
    left: 12,
    top: 2,
    bottom: 0,
    width: 2,
    alignItems: 'center',
  },
  dotContainer1: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#58B466',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  dot1: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#58B466',
  },
  dotContainer2: {
    width: 18,
    height: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#F99026',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    top: -55,
  },
  dot2: {
    width: 10,
    height: 10,
    borderRadius: 6,
    backgroundColor: '#F99026',
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: '#E5E5E5',
  },
  addresses: {
    marginLeft: 32,
  },
  addressBlock: {
    marginBottom: 24,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressInfo: {
    flex: 1,
    marginRight: 16,
  },
  addressType: {
    fontSize: 12,
    color: '#000000',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#808080',
  },
  changeButton: {
    padding: 8,
    backgroundColor: '#FFF5EC',
  },
  changeButtonText: {
    color: '#FF9B50',
    fontWeight: '600',
  },
  changeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeIcon: {
    width: 16,
    height: 16,
    marginRight: 6,
    resizeMode: 'contain',
  },
});
