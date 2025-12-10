import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';
const { width, height } = Dimensions.get('window');

const PickupOrderScreen = () => {
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [modalVisible, setModalVisible] = useState(true);
const navigation = useNavigation<NavigationProps>();
  type NavigationProps = StackNavigationProp<RootStackParamList>;
  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      } else if (minutes > 0) {
        setMinutes(minutes - 1);
        setSeconds(59);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [minutes, seconds]);

  const formatTime = (value: number): string => {
    return value < 10 ? `0${value}` : `${value}`;
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                navigation.navigate('OrderDropOff');
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Modal Title */}
            <Text style={styles.modalTitle}>Waiting to Drop Off Order</Text>

            {/* Modal Description */}
            <Text style={styles.modalDescription}>
              If the dry cleaning order is not ready for{'\n'}
              pickup in 5 minutes, the order will be
            </Text>

            {/* Timer Circle */}
            <View style={styles.timerContainer}>
              <View style={styles.timerCircle}>
                <Text style={styles.timerText}>
                  {formatTime(minutes)}:{formatTime(seconds)}
                </Text>
                <View style={styles.timerLabels}>
                  <Text style={styles.minutesLabel}>Minutes</Text>
                  <Text style={styles.secondsLabel}>Second</Text>
                </View>
              </View>
            </View>

            {/* Cancel Button */}
            <TouchableOpacity style={styles.cancelButton} onPress={() => {
              navigation.navigate('CancelDropOff');
            }}>
              <Text style={styles.cancelButtonText}>Cancel DropOff</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: -45,
    right: -1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#666',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 26,
    fontWeight: '400',
    color: '#FFA500',
    marginTop: 20,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  timerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: '#FFA733',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 30,
    fontWeight: '400',
    color: '#FFA500',
  },
  timerLabels: {
    flexDirection: 'row',
    marginTop: 5,
  },
  minutesLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  secondsLabel: {
    fontSize: 14,
    color: '#666',
  },
  cancelButton: {
    width: '70%',
    height: 55,
    backgroundColor: '#666',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default PickupOrderScreen;
