import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateAbout } from '../../components/redux/dryCleanerSlice'; // Redux action
import { RootState } from '../../components/redux/store';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import colors from '../../assets/color';
import Icon from 'react-native-paper/src/components/Icon';

const DryCleanAbout = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Fetch "About" data from Redux store
  const aboutText = useSelector((state: RootState) => state.dryCleaner.about);

  // Local state for input field
  const [about, setAbout] = useState(aboutText);

  // Function to handle applying the changes
  const handleApply = () => {
    if (about.trim() !== '') {
      dispatch(updateAbout(about)); // Dispatch action to update Redux state
      navigation.goBack(); // Navigate back to the previous screen
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden={false} barStyle="light-content" backgroundColor={colors.black} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon source="arrow-left" size={30} color={colors.brandColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dry Cleaner Merchant Details</Text>
      </View>

      {/* About Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Dry Cleaning Info</Text>

        {/* About Input */}
        <Text style={styles.label}>About :</Text>
        <TextInput
          style={styles.input}
          value={about}
          onChangeText={setAbout}
          placeholder="Edit details about dry cleaning merchant"
          placeholderTextColor={colors.gray}
          multiline
        />
      </View>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
        <Text style={styles.applyText}>Apply</Text>
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.cancelText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

// **Styles**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    paddingHorizontal: responsiveWidth(5),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '25%',
  },
  headerTitle: {
    fontSize: responsiveFontSize(2.5),
    color: '#FFF',
    fontWeight: 'bold',
    marginLeft: responsiveWidth(5),
  },
  card: {
    backgroundColor: '#FFF',
    padding: responsiveWidth(5),
    borderRadius: 15,
    marginTop: responsiveHeight(3),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: responsiveHeight(2),
  },
  label: {
    fontSize: responsiveFontSize(1.8),
    color: colors.black,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    color: colors.black,
    marginTop: responsiveHeight(1),
  },
  applyButton: {
    backgroundColor: colors.brandColor,
    paddingVertical: responsiveHeight(2),
    borderRadius: 30,
    alignItems: 'center',
    marginTop: responsiveHeight(3),
  },
  applyText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#5E5E5E',
    paddingVertical: responsiveHeight(2),
    borderRadius: 30,
    alignItems: 'center',
    marginTop: responsiveHeight(2),
  },
  cancelText: {
    color: '#FFF',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
});

export default DryCleanAbout;
