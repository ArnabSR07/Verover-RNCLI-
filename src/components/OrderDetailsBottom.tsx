import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import { images } from '../assets/images/images';

interface OrderDetailsBottomProps {
  selectedPickupAddress: string;
  selectedDeliveryAddress: string;
  showPickupModal: boolean;
  showDeliveryModal: boolean;
  setShowPickupModal: (show: boolean) => void;
  setShowDeliveryModal: (show: boolean) => void;
  setSelectedPickupAddress: (address: string) => void;
  setSelectedDeliveryAddress: (address: string) => void;
  handleCall: () => void;
}

const addresses = [
  '456 Park Avenue, New York',
  '789 Broadway, New York',
  '321 Madison Avenue, New York',
  '123, Lincon Street, New York',
  '30 Lincoln St, New Rochelle, New York',
];

export default function OrderDetailsBottom({
  selectedPickupAddress,
  selectedDeliveryAddress,
  showPickupModal,
  showDeliveryModal,
  setShowPickupModal,
  setShowDeliveryModal,
  setSelectedPickupAddress,
  setSelectedDeliveryAddress,
  handleCall,
}: OrderDetailsBottomProps) {
  return (
    <>
      {/* Cleaner Info */}
      <View style={styles.cleanerSection}>
        <View style={styles.cleanerInfo}>
          <View style={styles.circleContainer}>
            <Image source={images.washing} style={styles.cleanerImage} />
          </View>
          <View style={styles.cleanerDetails}>
            <Text style={styles.cleanerName}>Mico Cleaners</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>★ 4.2</Text>
              <Text style={styles.cleanerAddress}>
                123, Lincon Street, New York
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>

      {/* Items List */}
      <View style={styles.itemsSection}>
        <Text style={styles.sectionTitle}>List Of Items</Text>
        {[
          {name: 'T-Shirt', service: 'Wash Only', price: 10.0, quantity: 2},
          {name: 'Shirt', service: 'Wash & Fold', price: 30.0, quantity: 3},
          {name: 'Jacket', service: 'Wash Only', price: 25.0, quantity: 1},
        ].map((item, index) => (
          <View key={index} style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemService}>{item.service}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <Text style={styles.itemQuantity}>{item.quantity}</Text>
          </View>
        ))}
      </View>

      {/* Fixed QR Code */}
      <View style={styles.qrContainer}>
        <Text style={styles.qrTitle}>My QR Code</Text>
        <TouchableOpacity>
          <Image source={images.Scanner} style={styles.qrImage} />
        </TouchableOpacity>
      </View>

      {/* Address Change Modals */}
      <Modal visible={showPickupModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Pickup Address</Text>
            {addresses.map((address, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedPickupAddress(address);
                  setShowPickupModal(false);
                }}>
                <Text style={styles.modalAddressText}>{address}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowPickupModal(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showDeliveryModal} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Delivery Address</Text>
            {addresses.map((address, index) => (
              <TouchableOpacity
                key={index}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedDeliveryAddress(address);
                  setShowDeliveryModal(false);
                }}>
                <Text style={styles.modalAddressText}>{address}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowDeliveryModal(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  cleanerSection: {
    padding: 19,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopColor: '#E5E5E5',
    marginTop: 20,
  },
  cleanerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cleanerDetails: {
    marginLeft: -1,
  },
  cleanerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FF9B50',
    marginRight: 8,
  },
  cleanerAddress: {
    color: '#808080',
    fontSize: 12,
  },
  callButton: {
    backgroundColor: '#666',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  callButtonText: {
    color: '#fff',
    alignContent: 'center',
  },
  itemsSection: {
    padding: 15,
    marginBottom: 160, // Added space for QR code
  },
  sectionTitle: {
    fontSize: 16,
    color: '#F99026',
    marginBottom: 15,
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
  itemName: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 4,
    color: '#000',
  },
  itemInfo: {},
  itemService: {
    color: '#666',
    fontSize: 14,
    marginBottom: 4,
  },
  itemPrice: {
    color: '#FF9B50',
    fontSize: 16,
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 16,
    fontWeight: '400',
    color: '#333',
  },
  qrContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    zIndex: 2,
  },
  qrTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#000',
  },
  qrImage: {
    height: 90,
    width: 90,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  modalItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  modalButton: {
    marginTop: 16,
    backgroundColor: '#F99026',
    padding: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  modalAddressText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '400',
  },
  circleContainer: {
    width: 40,
    height: 40,
    borderRadius: 30,
    backgroundColor: '#F99026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  cleanerImage: {
    width: 16,
    height: 21,
    resizeMode: 'cover',
  },
});
