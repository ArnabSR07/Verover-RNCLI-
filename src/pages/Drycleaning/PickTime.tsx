import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-paper/src/components/Icon';
import colors from '../../assets/color';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'react-native-element-dropdown';
import { saveSchedulingData, SchedulingData } from '../../components/redux/userSlice';

type RootStackParamList = {
  DryorderSummary: undefined;
};

interface RootState {
  user?: {
    scheduling?: SchedulingData;
  };
}

const { width } = Dimensions.get('window');

const PickupDeliveryScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  
  // Get saved scheduling data from Redux with proper typing
  const savedScheduling = useSelector((state: RootState) => state.user?.scheduling);

  // State with initial values from Redux if available
  const [selectedPickupDate, setSelectedPickupDate] = useState<string>(
    savedScheduling?.pickupDate || '03'
  );
  const [selectedPickupTime, setSelectedPickupTime] = useState<string>(
    savedScheduling?.pickupTime || '10:00AM'
  );
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<string>(
    savedScheduling?.deliveryDate || '04'
  );
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState<string>(
    savedScheduling?.deliveryTime || '04:00PM'
  );
  const [pickupMonth, setPickupMonth] = useState<string>(
    savedScheduling?.pickupMonth || 'November'
  );
  const [deliveryMonth, setDeliveryMonth] = useState<string>(
    savedScheduling?.deliveryMonth || 'November'
  );

  const dates: string[] = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  ];
  
  const pickupTimes: string[] = ['08:00AM', '09:00AM', '10:00AM', '11:00AM', '12:00PM'];
  const deliveryTimes: string[] = ['01:00PM', '02:00PM', '03:00PM', '04:00PM', '05:00PM'];
  
  const months: { label: string; value: string }[] = [
    { label: 'January', value: 'January' },
    { label: 'February', value: 'February' },
    { label: 'March', value: 'March' },
    { label: 'April', value: 'April' },
    { label: 'May', value: 'May' },
    { label: 'June', value: 'June' },
    { label: 'July', value: 'July' },
    { label: 'August', value: 'August' },
    { label: 'September', value: 'September' },
    { label: 'October', value: 'October' },
    { label: 'November', value: 'November' },
    { label: 'December', value: 'December' },
  ];

  // Save to Redux whenever any scheduling data changes
  const saveToRedux = () => {
    const schedulingData: SchedulingData = {
      pickupDate: selectedPickupDate,
      pickupTime: selectedPickupTime,
      pickupMonth: pickupMonth,
      deliveryDate: selectedDeliveryDate,
      deliveryTime: selectedDeliveryTime,
      deliveryMonth: deliveryMonth,
      lastUpdated: new Date().toISOString(),
    };
    
    dispatch(saveSchedulingData(schedulingData));
    console.log('Scheduling data saved to Redux:', schedulingData);
  };

  // Save to Redux whenever state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToRedux();
    }, 500); // Debounce for 500ms to avoid too many Redux updates

    return () => clearTimeout(timeoutId);
  }, [selectedPickupDate, selectedPickupTime, pickupMonth, selectedDeliveryDate, selectedDeliveryTime, deliveryMonth]);

  interface DateButtonProps {
    date: string;
    isSelected: boolean;
    onPress: () => void;
  }

  const DateButton: React.FC<DateButtonProps> = ({ date, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.dateButton,
        isSelected && styles.selectedDateButton,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.dateButtonText,
        isSelected && styles.selectedDateButtonText,
      ]}>
        {date}
      </Text>
    </TouchableOpacity>
  );

  interface TimeButtonProps {
    time: string;
    isSelected: boolean;
    onPress: () => void;
  }

  const TimeButton: React.FC<TimeButtonProps> = ({ time, isSelected, onPress }) => (
    <TouchableOpacity
      style={[
        styles.timeButton,
        isSelected && styles.selectedTimeButton,
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.timeButtonText,
        isSelected && styles.selectedTimeButtonText,
      ]}>
        {time}
      </Text>
    </TouchableOpacity>
  );

  const handleContinue = () => {
    // Ensure data is saved before navigation
    saveToRedux();
    navigation.navigate('DryorderSummary');
  };

  // Custom render function for dropdown right icon
  const renderRightIcon = () => (
    <View style={styles.dropdownIconContainer}>
      <Text style={styles.dropdownIcon}>▼</Text>
    </View>
  );

  // Safe date formatter function
  const formatLastUpdated = (dateString?: string): string => {
    if (!dateString) return 'Never';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Schedule Pickup and Delivery</Text>
        </View>

        <View style={styles.section1}>
          <Text style={styles.sectionTitle}>Select Pickup Date & Time</Text>

          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>Pickup Date</Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              data={months}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={pickupMonth}
              onChange={item => {
                if (item && item.value) {
                  setPickupMonth(item.value);
                }
              }}
              placeholder="Select month"
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.dropdownItemText}
              renderRightIcon={renderRightIcon}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
            {dates.map((date) => (
              <DateButton
                key={`pickup-${date}`}
                date={date}
                isSelected={date === selectedPickupDate}
                onPress={() => setSelectedPickupDate(date)}
              />
            ))}
          </ScrollView>

          <Text style={styles.timeLabel}>Pickup Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timesContainer}>
            {pickupTimes.map((time) => (
              <TimeButton
                key={`pickup-${time}`}
                time={time}
                isSelected={time === selectedPickupTime}
                onPress={() => setSelectedPickupTime(time)}
              />
            ))}
          </ScrollView>
        </View>

        <View style={styles.section2}>
          <Text style={styles.sectionTitle}>Select Delivery Date & Time</Text>

          <View style={styles.dateSection}>
            <Text style={styles.dateLabel}>Delivery Date</Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              data={months}
              maxHeight={300}
              labelField="label"
              valueField="value"
              value={deliveryMonth}
              onChange={item => {
                if (item && item.value) {
                  setDeliveryMonth(item.value);
                }
              }}
              placeholder="Select month"
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              itemTextStyle={styles.dropdownItemText}
              renderRightIcon={renderRightIcon}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
            {dates.map((date) => (
              <DateButton
                key={`delivery-${date}`}
                date={date}
                isSelected={date === selectedDeliveryDate}
                onPress={() => setSelectedDeliveryDate(date)}
              />
            ))}
          </ScrollView>

          <Text style={styles.timeLabel}>Delivery Time</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timesContainer}>
            {deliveryTimes.map((time) => (
              <TimeButton
                key={`delivery-${time}`}
                time={time}
                isSelected={time === selectedDeliveryTime}
                onPress={() => setSelectedDeliveryTime(time)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Debug info - Remove in production */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              {`Saved: ${savedScheduling ? 'Yes' : 'No'}`}
            </Text>
            {savedScheduling && savedScheduling.lastUpdated && (
              <Text style={styles.debugText}>
                {`Last updated: ${formatLastUpdated(savedScheduling.lastUpdated)}`}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 8,
    color: '#000000',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 65,
    left: -15,
  },
  section1: {
    marginBottom: -20,
  },
  section2: {
    marginBottom: -10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '400',
    marginBottom: 20,
    color: '#707070',
    top: 50,
  },
  dateSection: {
    marginBottom: 10,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 5,
    color: '#000000',
    top: 40,
  },
  dropdown: {
    height: 50,
    width: width * 0.3,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 0,
    color: '#000000',
    alignSelf: 'flex-end',
    marginRight: 20,
  },
  dropdownContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 150,
    width: 105,
    shadowColor: '#000000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#666',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000000',
  },
  dropdownItemText: {
    color: '#000000',
    fontSize: 13,
  },
  dropdownIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 8,
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  datesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateButton: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF5EC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 8,
  },
  selectedDateButton: {
    backgroundColor: '#FF9933',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000',
  },
  selectedDateButtonText: {
    color: '#fff',
  },
  timeLabel: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 30,
    color: '#000000',
  },
  timesContainer: {
    flexDirection: 'row',
  },
  timeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#666666',
    borderRadius: 6,
    marginRight: 10,
  },
  selectedTimeButton: {
    backgroundColor: '#FF9933',
  },
  timeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  selectedTimeButtonText: {
    color: '#fff',
  },
  continueButton: {
    backgroundColor: '#FF9933',
    padding: 15,
    borderRadius: 30,
    margin: 20,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
});

export default PickupDeliveryScreen;