import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OrderHistoryPopup {
  isVisible: boolean;
  onClose: () => void;
  orderNumber: string;
}

export default function OrderHistoryPopup({ isVisible, onClose, orderNumber }: OrderHistoryPopup) {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState('');

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Pressable key={i} onPress={() => setRating(i)}>
          <Icon
            name={i <= rating ? 'star' : 'star-outline'}
            size={32}
            color="#FF8C00"
            style={styles.star}
          />
        </Pressable>
      );
    }
    return stars;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Icon name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={styles.orderInfo}>
              <Text style={styles.orderLabel}>Order Number</Text>
              <Text style={styles.orderNumber}>#{orderNumber}</Text>
            </View>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsText}>Details</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.orderStatus}>Order Completed</Text>

          <Text style={styles.ratingTitle}>Driver Rating & Review</Text>

          <View style={styles.starsContainer}>
            {renderStars()}
          </View>

          <TextInput
            style={styles.reviewInput}
            placeholder="Write Your Review..."
            multiline
            value={review}
            onChangeText={setReview}
            placeholderTextColor="#999"
          />

          <TouchableOpacity style={styles.submitButton} onPress={onClose}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: '50%',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 20,
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  orderInfo: {
    flex: 1,
  },
  orderLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsButton: {
    padding: 8,
  },
  detailsText: {
    color: '#666',
    fontSize: 16,
    top:20,
  },
  orderStatus: {
    color: '#FF8C00',
    fontSize: 18,
    marginBottom: 30,
  },
  ratingTitle: {
    fontSize: 17,
    color: '#666',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  star: {
    marginHorizontal: 1,
    left:115,
    top:-45,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 15,
    padding: 15,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
    color:'#000000',
  },
  submitButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    marginTop: 'auto',
  },
  submitText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
