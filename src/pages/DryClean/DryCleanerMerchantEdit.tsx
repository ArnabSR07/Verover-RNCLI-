import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { updateDryCleaner } from '../../components/redux/dryCleanerSlice';
import { RootState } from '../../components/redux/store';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../assets/color';
import Icon from 'react-native-paper/src/components/Icon';

const DryCleanerMerchantEdit = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { name, streetAddress } = useSelector((state: RootState) => state.dryCleaner);

    // State for form fields
    const [dryCleanerName, setDryCleanerName] = useState(name);
    const [street, setStreet] = useState(streetAddress);
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');

    // Function to handle Apply button
    const handleApply = () => {
        if (!dryCleanerName || !street || !city || !state || !zipCode) {
            Alert.alert('Missing Information', 'Please fill in all fields before applying.');
            return;
        }

        // Dispatch the updated details to Redux
        dispatch(updateDryCleaner({ name: dryCleanerName, streetAddress: street }));
        Alert.alert('Success', 'Dry Cleaning Details Updated Successfully!');
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={35} color={colors.brandColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dry Cleaner Merchant Details</Text>
            </View>

            {/* Form Section */}
            <ScrollView style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Dry Cleaning Info</Text>

                {/* Name of Dry Cleaner */}
                <Text style={styles.label}>Name of Dry Cleaner</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Please enter the name of your dry cleaner"
                    value={dryCleanerName}
                    onChangeText={setDryCleanerName}
                />

                {/* Street Address */}
                <Text style={styles.label}>Street Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Please enter street number and name"
                    value={street}
                    onChangeText={setStreet}
                />

                {/* City */}
                <Text style={styles.label}>City</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter City Name"
                    value={city}
                    onChangeText={setCity}
                />

                {/* State and Zip Code */}
                <View style={styles.rowContainer}>
                    <View style={styles.halfWidth}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter State"
                            value={state}
                            onChangeText={setState}
                        />
                    </View>
                    <View style={styles.halfWidth}>
                        <Text style={styles.label}>Zip Code</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter Zip Code"
                            value={zipCode}
                            onChangeText={setZipCode}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                {/* Apply and Cancel Buttons */}
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsiveWidth(5),
        marginTop: '25%',
    },
    headerTitle: {
        fontSize: responsiveFontSize(2.5),
        color: '#FFF',
        marginLeft: responsiveWidth(5),
        fontWeight: 'bold',
    },
    formContainer: {
        backgroundColor: '#FFF',
        marginHorizontal: responsiveWidth(5),
        padding: responsiveWidth(5),
        borderRadius: 12,
        marginTop: responsiveHeight(2),
    },
    sectionTitle: {
        fontSize: responsiveFontSize(2.2),
        marginBottom: responsiveHeight(2),
        color: colors.black,
    },
    label: {
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        marginTop: responsiveHeight(2),
    },
    input: {


        borderBottomWidth: 1,
        borderColor: colors.gray,
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(4),
        fontSize: responsiveFontSize(2),
        color: colors.black,
        marginTop: responsiveHeight(1),
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    applyButton: {
        backgroundColor: colors.brandColor,
        paddingVertical: responsiveHeight(2),
        borderRadius: 30,
        alignItems: 'center',
        marginTop: responsiveHeight(3),
    },
    applyButtonText: {
        color: '#FFF',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
    cancelButton: {
        backgroundColor: colors.gray,
        paddingVertical: responsiveHeight(2),
        borderRadius: 30,
        alignItems: 'center',
        marginTop: responsiveHeight(1),
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
});

export default DryCleanerMerchantEdit;
