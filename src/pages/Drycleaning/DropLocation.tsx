import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {images} from '../../assets/images/images';
import Icon from 'react-native-paper/src/components/Icon';
import colors from '../../assets/color';
import {Picker} from '@react-native-picker/picker';
import {State, City} from 'country-state-city';

interface PickupLocationProps {
  navigation?: any;
}

const PickupLocation: React.FC<PickupLocationProps> = ({navigation}) => {
  const [selectedAddress, setSelectedAddress] = useState<string>('home');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [zipCode, setZipCode] = useState<string>('07030');
  const [statesList, setStatesList] = useState<any[]>([]);
  const [citiesList, setCitiesList] = useState<any[]>([]);

  // Load states on component mount
  useEffect(() => {
    const states = State.getStatesOfCountry('US');
    setStatesList(states);
    if (states.length > 0) {
      setState(states[0].isoCode);
      loadCities(states[0].isoCode);
    }
  }, []);

  // Load cities when state changes
  const loadCities = (stateCode: string) => {
    const cities = City.getCitiesOfState('US', stateCode);
    setCitiesList(cities);
    if (cities.length > 0) {
      setCity(cities[0].name);
    }
  };

  // Handle state change
  const handleStateChange = (stateCode: string) => {
    setState(stateCode);
    loadCities(stateCode);
  };

  // Handle address type selection
  const handleAddressSelect = (type: string) => {
    setSelectedAddress(type);
  };

  // Get address title based on selected address type
  const getAddressTitle = () => {
    if (selectedAddress === 'home') {
      return 'Enter Home Address Details';
    }
    if (selectedAddress === 'office') {
      return 'Enter Office Address Details';
    }
    if (selectedAddress === 'new') {
      return 'Enter New Address Details';
    }
    return 'Enter Address Details';
  };

  // Get state name from state code
  const getStateName = (stateCode: string) => {
    const stateObj = statesList.find(state => state.isoCode === stateCode);
    return stateObj ? stateObj.name : '';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Title Section */}
        <View style={styles.titleSection}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Drop Location</Text>
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Select Drop Address</Text>
        </View>

        {/* Address Options */}
        <View style={styles.addressOptions}>
          <TouchableOpacity
            style={[
              styles.addressCard,
              selectedAddress === 'home' && styles.selectedAddressCard,
            ]}
            onPress={() => handleAddressSelect('home')}>
            <Image
              source={images.home}
              style={styles.addressIcon}
              resizeMode="cover"
            />
            <Text style={styles.addressText}>Home</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addressCard,
              selectedAddress === 'office' && styles.selectedAddressCard,
            ]}
            onPress={() => handleAddressSelect('office')}>
            <Image
              source={images.business}
              style={styles.addressIcon}
              resizeMode="cover"
            />
            <Text style={styles.addressText}>Office</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.addressCard,
              selectedAddress === 'new' && styles.selectedAddressCard,
            ]}
            onPress={() => handleAddressSelect('new')}>
            <Image
              source={images.business}
              style={styles.addressIcon}
              resizeMode="cover"
            />
            <Text style={styles.addressText}>New Address</Text>
          </TouchableOpacity>
        </View>

        {/* Address Form */}
        {(selectedAddress === 'new' ||
          selectedAddress === 'home' ||
          selectedAddress === 'office') && (
          <View style={styles.formSection}>
            <Text style={styles.formTitle}>{getAddressTitle()}</Text>

            {/* Address Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Your Address"
                value={address}
                onChangeText={setAddress}
              />
            </View>

            {/* State Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>State</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={state}
                  onValueChange={handleStateChange}
                  style={styles.picker}>
                  {statesList.map(state => (
                    <Picker.Item
                      key={state.isoCode}
                      label={state.name}
                      value={state.isoCode}
                    />
                  ))}
                </Picker>
                <Image
                  source={images.dropdownarrow}
                  style={styles.dropdownIcon}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* City Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>City</Text>
              <View style={styles.dropdownContainer}>
                <Picker
                  selectedValue={city}
                  onValueChange={setCity}
                  style={styles.picker}>
                  {citiesList.map(city => (
                    <Picker.Item
                      key={city.name}
                      label={city.name}
                      value={city.name}
                    />
                  ))}
                </Picker>
                <Image
                  source={images.dropdownarrow}
                  style={styles.dropdownIcon}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* ZIP Code Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ZIP Code</Text>
              <TextInput
                style={styles.input}
                value={zipCode}
                onChangeText={setZipCode}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>
          </View>
        )}

        {/* Bottom Buttons */}
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('PickTime')}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => navigation.navigate('DropLocation')}>
            <Text style={styles.skipButtonText}>Skip This Step</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  logo: {
    height: 24,
    width: 100,
    resizeMode: 'contain',
  },
  icon: {
    width: 24,
    height: 24,
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B00',
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 74,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 8,
    color: '#000000',
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
  },
  orderHistory: {
    color: '#FF6B00',
    fontSize: 14,
    fontWeight: '300',
  },
  addressOptions: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    gap: 12,
    marginBottom: 32,
  },
  addressCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 19,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addressIcon: {
    width: 34,
    height: 39,
    marginBottom: 4,
  },
  addressText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#000000',
  },
  formSection: {
    paddingHorizontal: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '500',
    marginBottom: 24,
    color: '#707070',
  },
  inputContainer: {
    marginBottom: 30,
    borderBottomWidth: 0.5,
  },
  label: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  input: {
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
    fontSize: 16,
    color: '#000000',
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 8,
  },
  dropdownText: {
    fontSize: 16,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  picker: {
    flex: 1,
    color: '#000000',
    height: 50,
  },
  dropdownIcon: {
    width: 16,
    height: 10,
    left: -10,
    tintColor: '#9D9D9D',
  },

  bottomButtons: {
    padding: 16,
    marginTop: 'auto',
  },
  continueButton: {
    backgroundColor: '#F99026',
    borderRadius: 29,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    width: 180,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButton: {
    backgroundColor: '#5E5E60',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    width: 180,
    left: 190,
    top: -64,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedAddressCard: {
    backgroundColor: '#FDF1E5',
  },
});

export default PickupLocation;
