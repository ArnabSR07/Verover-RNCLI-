import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  ScrollView,
} from 'react-native';
import {Menu, Provider} from 'react-native-paper';
import {images} from '../../assets/images/images';
import Icon from 'react-native-paper/src/components/Icon';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
export default function BookingScreen() {
  const [city, setCity] = useState('Pleasanton');
  const [state, setState] = useState('California');
  const [zipCode, setZipCode] = useState('07030');
  const [address, setAddress] = useState('');
  const [cityVisible, setCityVisible] = useState(false);
  const [stateVisible, setStateVisible] = useState(false);
  type RootStackParamList = {
    OrderHistory: undefined;
  };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const handleCall = () => {
    Linking.openURL('tel:+1234567890');
  };
  return (
    <Provider>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon source="arrow-left" size={35} color="#FF8C00" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Active Order Details</Text>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{paddingBottom: 100}}>
          <View style={styles.mapContainer}>
            <Image
              source={images.BookingConfirmationMap}
              style={styles.mapImage}
            />
            <Image source={images.targetmarker} style={styles.target} />
            <Image source={images.path} style={styles.path} />
            <Image source={images.User} style={styles.user} />
            <View style={styles.locationContainer}>
              <TouchableOpacity>
                <Image
                  source={images.currentlocation}
                  style={styles.location}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.addressContainer}>
            <View style={styles.addressHeader}>
              <Text style={styles.sectionTitle}>
                Pickup and Delivery Address
              </Text>
              <TouchableOpacity style={styles.callButton} onPress={handleCall}>
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.addressPoint}>
              <View style={styles.dotWrapperGreen}>
                <View style={[styles.dot, styles.greenDot]} />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressLabel}>Pickup</Text>
                <Text style={styles.addressText}>
                  123, Lincoln Street, New York
                </Text>
              </View>
            </View>

            <View style={styles.verticalLine} />

            <View style={styles.addressPoint}>
              <View style={styles.dotWrapperOrange}>
                <View style={[styles.dot, styles.orangeDot]} />
              </View>
              <View style={styles.addressTextContainer}>
                <Text style={styles.addressLabel}>Drop Off</Text>
                <Text style={styles.addressText}>
                  30 Lincoln St, New Rochelle, New York
                </Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Change Delivery Address</Text>
            <Text style={styles.chargeText}>
              Pay additional charge for delay
            </Text>

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Address"
              placeholderTextColor="#000000"
              value={address}
              onChangeText={setAddress}
            />

            <Text style={styles.inputLabel}>City</Text>
            <View style={styles.dropdownContainer}>
              <TextInput
                style={[styles.input, styles.dropdownInput]}
                placeholder="Select City"
                value={city}
                editable={false}
              />
              <Menu
                visible={cityVisible}
                onDismiss={() => setCityVisible(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setCityVisible(true)}
                    style={styles.dropdownButton}>
                    <Icon source="menu-down" size={24} color="#333" />
                  </TouchableOpacity>
                }
                contentStyle={styles.dropdownContent}>
                <Menu.Item
                  onPress={() => {
                    setCity('Pleasanton');
                    setCityVisible(false);
                  }}
                  title="Pleasanton"
                  titleStyle={styles.dropdownItemText}
                />
                <Menu.Item
                  onPress={() => {
                    setCity('San Francisco');
                    setCityVisible(false);
                  }}
                  title="San Francisco"
                  titleStyle={styles.dropdownItemText}
                />
              </Menu>
            </View>

            <Text style={styles.inputLabel}>State</Text>
            <View style={styles.dropdownContainer}>
              <TextInput
                style={[styles.input, styles.dropdownInput]}
                placeholder="Select State"
                value={state}
                editable={false}
              />
              <Menu
                visible={stateVisible}
                onDismiss={() => setStateVisible(false)}
                anchor={
                  <TouchableOpacity
                    onPress={() => setStateVisible(true)}
                    style={styles.dropdownButton}>
                    <Icon source="menu-down" size={24} color="#333" />
                  </TouchableOpacity>
                }
                contentStyle={styles.dropdownContent}>
                <Menu.Item
                  onPress={() => {
                    setState('California');
                    setStateVisible(false);
                  }}
                  title="California"
                  titleStyle={styles.dropdownItemText}
                />
                <Menu.Item
                  onPress={() => {
                    setState('New York');
                    setStateVisible(false);
                  }}
                  title="New York"
                  titleStyle={styles.dropdownItemText}
                />
              </Menu>
            </View>

            <Text style={styles.inputLabel}>ZIP Code</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter ZIP Code"
              value={zipCode}
              onChangeText={setZipCode}
              keyboardType="numeric"
            />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneButton}  onPress={() => navigation.navigate('OrderHistory')}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    gap: 15,
  },
  backButton: {
    marginTop: 90,
    left: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    marginTop: 90,
  },
  mapContainer: {
    position: 'relative',
    width: '100%',
    height: 300,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  target: {
    position: 'absolute',
    top: '15%',
    right: '26%',
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  user: {
    position: 'absolute',
    bottom: '11%',
    left: '42%',
    width: 60,
    height: 70,
    resizeMode: 'contain',
  },
  path: {
    position: 'absolute',
    top: '20%',
    left: '35%',
    width: '40%',
    height: '50%',
    resizeMode: 'contain',
  },
  locationContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  location: {
    width:90,
    height:90,
    resizeMode: 'contain',
    top:25,
    left:10,
  },
  addressContainer: {
    padding: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
    color: '#F99026',
  },
  addressPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dotWrapperGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#58B466',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dotWrapperOrange: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#F99026',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  greenDot: {
    backgroundColor: '#58B466',
  },
  orangeDot: {
    backgroundColor: '#F99026',
  },
  verticalLine: {
    width: 2,
    height: 40,
    backgroundColor: '#E5E5E5',
    alignSelf: 'center',
    marginLeft: -340,
  },
  addressTextContainer: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
  },
  chargeText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#C6C6C6',
    padding: 13,
    marginBottom: 16,
    color:'#000000',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dropdownInput: {
    flex: 1,
    marginRight: 8,
  },
  dropdownButton: {
    padding: 8,
  },
  dropdownContent: {
    backgroundColor: '#fff',
  },
  dropdownItemText: {
    color: '#333',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
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
    fontSize: 14,
    fontWeight: '600',
  },
  doneButton: {
    backgroundColor: '#FF8C00',
    padding: 16,
    borderRadius: 28,
    alignSelf: 'center',
    alignItems: 'center',
    width: 150,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
