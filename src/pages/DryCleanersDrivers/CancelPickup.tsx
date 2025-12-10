import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import colors from '../../assets/color';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';

const CancelBookingScreen = () => {
  const [selectedReason, setSelectedReason] = useState<number | null>(null);
  const [otherReason, setOtherReason] = useState('');
  const navigation = useNavigation<NavigationProps>();
  type NavigationProps = StackNavigationProp<RootStackParamList, 'LocateDryCleaning1'>;

  const reasons = [
    'Too far',
    'Cost',
    'Neighborhood',
    'Changed My Mind',
    'Cancelled Plan',
    'Other Reason',
  ];

  const handleReasonSelect = (index: number) => {
    setSelectedReason(index);
  };

  const handleCancelBooking = () => {
    // Handle cancel booking logic here
    console.log('Booking cancelled with reason:',  selectedReason !== null ? (selectedReason === 5 ? otherReason : reasons[selectedReason]) : '');
    // Navigate back or to confirmation screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon source="arrow-left" size={35} color={colors.brandColor} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Cancel Pickup</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Reason Selection */}
          <View style={styles.reasonsContainer}>
            {reasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reasonRow}
                onPress={() => handleReasonSelect(index)}
              >
                <View style={[
                  styles.radioButton,
                  selectedReason === index && styles.radioButtonSelected,
                ]}>
                  {selectedReason === index && <View style={styles.radioButtonInner} />}
                </View>
                <Text style={styles.reasonText}>{reason}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Other Reason Text Input */}
          {selectedReason === 5 && (
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Write Your Reason..."
                placeholderTextColor="#888"
                multiline
                value={otherReason}
                onChangeText={setOtherReason}
              />
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Cancel Now Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            navigation.navigate('LocateDryCleaning1');
        }}
        >
          <Text style={styles.cancelButtonText}>Cancel Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 70,
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    left:-5,
  },
  bookingId: {
    fontSize: 16,
    color: '#FF8C00',
    fontWeight: '500',
  },
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  reasonsContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  radioButton: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  radioButtonSelected: {
    borderColor: '#FF8C00',
  },
  radioButtonInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#FF8C00',
  },
  reasonText: {
    fontSize: 16,
    color: '#000',
  },
  textInputContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  textInput: {
    height: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    textAlignVertical: 'top',
    color: '#000000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  cancelButton: {
    backgroundColor: '#F99026',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CancelBookingScreen;
