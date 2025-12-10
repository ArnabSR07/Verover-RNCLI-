import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity ,Image} from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import {images} from '../../assets/images/images';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

type RootStackParamList = {
  ActiveOrderDetailes: undefined;
};
export default function ReceiptScreen() {
       const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
      <TouchableOpacity style={styles.backButton}   onPress={() => {
            navigation.goBack();
          }}>
          <Icon source="arrow-left" size={35} color="#FF8C00" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Receipt Of Purchase</Text>
          <Text style={styles.orderId}>#DC58223</Text>
        </View>
      </View>

      <View style={styles.trackingContainer}>
        <Text style={styles.trackingLabel}>TRACKING ID: </Text>
        <Text style={styles.trackingNumber}>1549</Text>
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Payment</Text>
        <Text style={styles.totalAmount}>$70.00</Text>
        <Text style={styles.paymentInfo}>
          We wish to inform you that $70 has been debited from your Debit Card no. ending with 1234 on 11-31-2021 20:44:58.
        </Text>
      </View>

      <View style={styles.orderDetailContainer}>
        <Text style={styles.sectionTitle}>Order Detail</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.qtyHeader}>QTY</Text>
          <Text style={styles.priceHeader}>Price</Text>
          <Text style={styles.itemsHeader}>Items</Text>
        </View>

        {/* T-Shirt Row */}
        <View style={styles.tableRow}>
          <Text style={styles.qtyCell}>2</Text>
          <Text style={styles.priceCell}>$10.00</Text>
          <View style={styles.itemCell}>
            <Text style={styles.itemName}>T-Shirt</Text>
            <Text style={styles.itemDetail}>Wash Only</Text>
          </View>
        </View>

        {/* Shirt Row */}
        <View style={styles.tableRow}>
          <Text style={styles.qtyCell}>3</Text>
          <Text style={styles.priceCell}>$30.00</Text>
          <View style={styles.itemCell}>
            <Text style={styles.itemName}>Shirt</Text>
            <Text style={styles.itemDetail}>Wash & Fold</Text>
          </View>
        </View>

        {/* Jacket Row */}
        <View style={styles.tableRow}>
          <Text style={styles.qtyCell}>1</Text>
          <Text style={styles.priceCell}>$25.00</Text>
          <View style={styles.itemCell}>
            <Text style={styles.itemName}>Jacket</Text>
            <Text style={styles.itemDetail}>Wash Only</Text>
          </View>
        </View>
      </View>

      <View style={styles.addressContainer}>

        <View style={styles.cleanerInfo}>
          <View style={styles.cleanerIconContainer}>
            <Image source={images.washing} style={styles.deleteButtonText}/>
          </View>
          <View style={styles.cleanerDetails}>
          <Text style={styles.sectionTitle}>Address Of The Dry Cleaner</Text>
            <Text style={styles.cleanerName}>Mico Cleaners</Text>
            <Text style={styles.cleanerAddress}>123, Lincon Street, New York</Text>
          </View>
        </View>

      </View>
      <Text style={styles.iconTitle}>For Unclaimed Items</Text>
      <View style={styles.unclaimedContainer}>

        <View style={styles.unclaimedItem}>
          <Text style={styles.unclaimedText}>Cost for waiting 60 minutes or more</Text>
          <Text style={styles.unclaimedPrice}>$15.00</Text>
        </View>
        <View style={styles.unclaimedItem}>
          <Text style={styles.unclaimedText}>Cost for overnight storage</Text>
          <Text style={styles.unclaimedPrice}>$20.00/Night</Text>
        </View>
        <View style={styles.unclaimedItem}>
          <Text style={styles.unclaimedText}>Cost for redelivery</Text>
          <Text style={styles.unclaimedPrice}>$10.00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.learnMoreButton}>
        <Text style={styles.learnMoreText}>Learn More</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.doneButton}    onPress={() => {
          navigation.navigate('ActiveOrderDetailes');
        }}>
        <Text style={styles.doneButtonText}>Done</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 54,
    top: 29,
  },
  backButton: {
    marginRight:1,
    top: 60,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
    top:20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    color:'#000000',
    left:40,
    top:9,
  },
  orderId: {
    color: '#FF8C00',
    fontSize: 16,
    top:10,
  },
  trackingContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  trackingLabel: {
    color: '#666',
    top:10,
  },
  trackingNumber: {
    color: '#FF8C00',
    top:10,
  },
  totalContainer: {
    alignItems: 'center',
    marginTop: 30,
    paddingHorizontal: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: '#000000',
  },
  totalAmount: {
    fontSize:50,
    color: '#F99026',
    fontWeight: '300',
    marginVertical: 10,
  },
  paymentInfo: {
    textAlign: 'center',
    color: '#000000',
    lineHeight:20,
    fontSize:14,
  },
  orderDetailContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 10,
    color:'#000000',
    top:-10,
  },
  iconTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 20,
    color:'#000000',
    top:15,
    alignSelf: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    gap:90,

  },
  qtyHeader: {
    flex: 1,
    color: '#666',

  },
  priceHeader: {
    flex: 2,
    color: '#666',
  },
  itemsHeader: {
    flex: 3,
    color: '#666',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#C4C4C4',
    gap:90,
  },
  qtyCell: {
    flex: 1,
    color:'#000000',
  },
  priceCell: {
    flex: 2,
    color: '#FF8C00',
  },
  itemCell: {
    flex: 3,
  },
  itemName: {
    fontWeight: '500',
    color:'#000000',
    fontSize:14,
  },
  itemDetail: {
    color: '#666',
    fontSize: 12,
    marginTop: 4,
  },
  addressContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  cleanerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    height: 'auto',
    minHeight: 100,
    justifyContent: 'flex-start',
    gap: 15,
},

  cleanerIconContainer: {
    backgroundColor: '#FF8C00',
    width: 50,
    height: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -3,
    top:12,
  },
  cleanerDetails: {
    flex: 1,
  },
  cleanerName: {
    fontSize: 16,
    fontWeight: '500',
    color:'#000000',
  },
  cleanerAddress: {
    color: '#666',
    marginTop: 4,
  },
  unclaimedContainer: {
    marginTop: 30,
    paddingHorizontal:14,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '95%',
    alignSelf: 'center',

  },
  unclaimedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 1,

  },
  unclaimedText: {
    color: '#F99026',
    fontSize:14,
  },
  unclaimedPrice: {
    color: '#FF8C00',
    fontSize:12,
  },
  learnMoreButton: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  learnMoreText: {
    color: '#666',
  },
  doneButton: {
    backgroundColor: '#FF8C00',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 30,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  deleteButtonText: {
    height: 25,
    width: 20,
  },
});
