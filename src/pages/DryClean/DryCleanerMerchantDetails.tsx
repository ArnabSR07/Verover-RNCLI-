import React, { useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { updateDryCleaner } from '../../components/redux/dryCleanerSlice';
import { RootState } from '../../components/redux/store';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../assets/color';
import Icon from 'react-native-paper/src/components/Icon';

const DryCleanerMerchantDetails = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { contactName, phone, imageUri } = useSelector((state: RootState) => state.dryCleaner);

    const [newContactName, setNewContactName] = useState(contactName);
    const [newPhone, setNewPhone] = useState(phone);
    const [newImageUri, setNewImageUri] = useState<string | null>(imageUri);

    // Open Image Picker
    const handleImagePick = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (response.assets && response.assets.length > 0) {
                setNewImageUri(response.assets[0].uri || null);
            }
        });
    };

    // Apply Changes to Redux Store
    const handleApply = () => {
        dispatch(updateDryCleaner({ contactName: newContactName, phone: newPhone, imageUri: newImageUri }));
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={30} color={colors.brandColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dry Cleaner Merchant Details</Text>
            </View>

            {/* Contact Info */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Contact Info</Text>

                {/* Profile Image */}
                <TouchableOpacity style={styles.imageContainer} onPress={handleImagePick}>
                    <Image source={newImageUri ? { uri: newImageUri } : require('../../assets/images/defaultProfile.png')} style={styles.profileImage} />
                    <Text style={styles.changeImageText}>Change Image</Text>
                </TouchableOpacity>

                {/* Contact Name Input */}
                <Text style={styles.label}>Contacts Name</Text>
                <TextInput style={styles.input} value={newContactName} onChangeText={setNewContactName} />

                {/* Phone Input */}
                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={newPhone} onChangeText={setNewPhone} keyboardType="phone-pad" />
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', paddingHorizontal: responsiveWidth(5) },
    header: { flexDirection: 'row', alignItems: 'center', marginTop: '25%' },
    headerTitle: { fontSize: responsiveFontSize(2.5), color: '#FFF', fontWeight: 'bold', marginLeft: responsiveWidth(5) },
    card: { backgroundColor: '#FFF', padding: responsiveWidth(5), borderRadius: 15, marginTop: responsiveHeight(3) },
    sectionTitle: { fontSize: responsiveFontSize(2.2), fontWeight: 'bold', color: colors.black, marginBottom: responsiveHeight(2) },
    imageContainer: { alignItems: 'center', marginBottom: responsiveHeight(2) },
    profileImage: { width: responsiveWidth(30), height: responsiveWidth(30), borderRadius: 100 },
    changeImageText: { color: colors.gray, marginTop: responsiveHeight(1), fontSize: responsiveFontSize(1.8) },
    label: { fontSize: responsiveFontSize(1.8), color: colors.gray, marginTop: responsiveHeight(1) },
    input: { backgroundColor: '#F5F5F5', borderRadius: 8, borderWidth: 1, borderColor: colors.lightGray, paddingVertical: responsiveHeight(1.5), paddingHorizontal: responsiveWidth(4), fontSize: responsiveFontSize(2), color: colors.black, marginTop: responsiveHeight(1) },
    applyButton: { backgroundColor: colors.brandColor, paddingVertical: responsiveHeight(2), borderRadius: 30, alignItems: 'center', marginTop: responsiveHeight(3) },
    applyText: { color: '#FFF', fontSize: responsiveFontSize(2), fontWeight: 'bold' },
    cancelButton: { backgroundColor: '#5E5E5E', paddingVertical: responsiveHeight(2), borderRadius: 30, alignItems: 'center', marginTop: responsiveHeight(2) },
    cancelText: { color: '#FFF', fontSize: responsiveFontSize(2), fontWeight: 'bold' },
});

export default DryCleanerMerchantDetails;
