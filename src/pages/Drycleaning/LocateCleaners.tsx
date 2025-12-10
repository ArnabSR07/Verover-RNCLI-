import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Icon from 'react-native-paper/src/components/Icon';
import { images } from '../../assets/images/images';
import colors from '../../assets/color';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const HEADER_MARGIN_TOP = Platform.OS === 'ios' ? 50 : 70;

type RootStackParamList = {
  DrycleanerList: undefined;
  OrderHistoryNew:undefined;
};

export const LocateDryCleaners: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        bounces={false}
      >
        {/* Back Navigation */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon source="arrow-left" size={35} color={colors.brandColor} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Locate Dry Cleaners</Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Image
            source={images.BookingConfirmationMap}
            style={styles.mapImage}
            resizeMode="cover"
          />

          {/* Map Markers */}

            <Image
            source={images.currentlocation}
            style={styles.currentLocationMarker}
          />


          <Image source={images.location} style={styles.targetMarker} />

          {/* Dry Cleaner Markers */}
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <Image
              key={index}
              source={images.targetmarker}
              style={[
                styles.dryCleanerMarker,
                (styles as any)[`dryCleanerMarker${index}`] ?? {}, // ✅ Fixed Type Issue
              ]}
            />
          ))}
        </View>

        {/* Location Input Section */}
        <View style={styles.locationSection}>
          <Text style={styles.locationTitle}>Location</Text>
          <View style={styles.locationInputContainer}>
            <Image source={images.location} style={styles.locationIcon} />
            <TextInput
              style={styles.locationInput}
              placeholder="Enter Location"
              placeholderTextColor="#000"
            />
          </View>
          <TouchableOpacity>
            <Text style={styles.useCurrentLocation}>Use Current Location</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Disclaimer that poor connection and other unforeseen events may delay
            your purchase or confirmation of the dry cleaners.
          </Text>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('DrycleanerList')}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.orderHistoryButton}
           onPress={() => navigation.navigate('OrderHistoryNew')}>
            <Text style={styles.orderHistoryText}>ORDER HISTORY</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ✅ Styles (No Changes, Fixed Type Errors)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: HEADER_MARGIN_TOP,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#f99026',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '400',
    marginLeft: 15,
    color: '#000000',
  },
  mapContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.45,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  currentLocationMarker: {
    position: 'absolute',
    width: 50,
    height: 90,
    left: '50%',
    top: '50%',
    marginLeft: 130,
    marginTop: 110,
  },
  targetMarker: {
    position: 'absolute',
    width: 60,
    height: 60,
    right: '40%',
    bottom: '30%',
  },
  dryCleanerMarker: {
    position: 'absolute',
    width: 30,
    height: 30,
  },
  dryCleanerMarker1: { left: '15%', top: '20%' },
  dryCleanerMarker2: { left: '35%', top: '30%' },
  dryCleanerMarker3: { right: '30%', top: '25%' },
  dryCleanerMarker4: { left: '25%', bottom: '35%' },
  dryCleanerMarker5: { right: '20%', bottom: '40%' },
  dryCleanerMarker6: { left: '20%', bottom: '25%' },
  locationSection: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  locationTitle: {
    fontSize: 19,
    fontWeight: '400',
    marginBottom: 20,
    color: '#000000',
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingBottom: 10,
    marginBottom: 15,
  },
  locationIcon: {
    width: 54,
    height: 54,
    marginRight: 10,
    tintColor: '#f99026',
  },
  locationInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  useCurrentLocation: {
    color: '#f99026',
    fontSize: 16,
    marginBottom: 20,
  },
  disclaimer: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 30,
  },
  continueButton: {
    backgroundColor: '#f99026',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
  },
  orderHistoryButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  orderHistoryText: {
    color: '#f99026',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default LocateDryCleaners;
