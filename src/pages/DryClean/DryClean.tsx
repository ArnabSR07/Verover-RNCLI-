import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../../assets/color';
import Icon from 'react-native-paper/src/components/Icon';
import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { RootState } from '../../components/redux/store';

interface Address {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

interface HoursOfOperation {
    day: string;
    open: string;
    close: string;
}

interface Service {
    name: string;
    category: string;
    strachLevel: number;
    washOnly: boolean;
    additionalservice: 'zipper' | 'button' | 'wash/fold';
    price: number;
}

interface FormData {
    shopname: string;
    address: Address;
    about: string;
    contactPerson: string;
    phoneNumber: string;
    hoursOfOperation: HoursOfOperation[];
    services: Service[];
}

interface SelectedImage {
    uri: string;
    type: string;
    fileName?: string;
}

interface Images {
    contactPersonImg: SelectedImage | null;
    shopImages: SelectedImage[];
}

const DryClean: React.FC = () => {
    const navigation = useNavigation();
    const authToken = useSelector((state: RootState) => state.auth.token); // Assuming you have auth state
    
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        shopname: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        },
        about: '',
        contactPerson: '',
        phoneNumber: '',
        hoursOfOperation: [
            { day: 'Monday', open: '09:00 AM', close: '07:00 PM' },
            { day: 'Tuesday', open: '09:00 AM', close: '07:00 PM' },
            { day: 'Wednesday', open: '09:00 AM', close: '07:00 PM' },
            { day: 'Thursday', open: '09:00 AM', close: '07:00 PM' },
            { day: 'Friday', open: '09:00 AM', close: '07:00 PM' },
            { day: 'Saturday', open: '09:00 AM', close: '05:00 PM' },
            { day: 'Sunday', open: '10:00 AM', close: '04:00 PM' },
        ],
        services: [
            {
                name: 'Shirt Cleaning',
                category: 'Clothes',
                strachLevel: 3,
                washOnly: false,
                additionalservice: 'zipper',
                price: 50,
            },
        ],
    });
    
    const [images, setImages] = useState<Images>({
        contactPersonImg: null,
        shopImages: [],
    });

    // Handle text input changes
    const handleInputChange = (field: string, value: string): void => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    // Handle hours of operation changes
    const handleHoursChange = (index: number, field: keyof HoursOfOperation, value: string): void => {
        setFormData(prev => ({
            ...prev,
            hoursOfOperation: prev.hoursOfOperation.map((hour, i) =>
                i === index ? { ...hour, [field]: value } : hour
            ),
        }));
    };

    // Handle service changes
    const handleServiceChange = (index: number, field: keyof Service, value: string | number | boolean): void => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.map((service, i) =>
                i === index ? { ...service, [field]: value } : service
            ),
        }));
    };

    // Add new service
    const addService = (): void => {
        setFormData(prev => ({
            ...prev,
            services: [
                ...prev.services,
                {
                    name: '',
                    category: '',
                    strachLevel: 3,
                    washOnly: false,
                    additionalservice: 'zipper' as const,
                    price: 0,
                },
            ],
        }));
    };

    // Remove service
    const removeService = (index: number): void => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.filter((_, i) => i !== index),
        }));
    };

    // Handle contact person image selection
    const handleContactImagePick = (): void => {
        launchImageLibrary({ mediaType: 'photo' }, (response: ImagePickerResponse) => {
            if (response.assets && response.assets.length > 0) {
                const asset = response.assets[0];
                setImages(prev => ({
                    ...prev,
                    contactPersonImg: {
                        uri: asset.uri!,
                        type: asset.type!,
                        fileName: asset.fileName,
                    },
                }));
            }
        });
    };

    // Handle shop images selection
    const handleShopImagesPick = (): void => {
        launchImageLibrary({ 
            mediaType: 'photo',
            selectionLimit: 4,
        }, (response: ImagePickerResponse) => {
            if (response.assets && response.assets.length > 0) {
                const selectedImages: SelectedImage[] = response.assets.map(asset => ({
                    uri: asset.uri!,
                    type: asset.type!,
                    fileName: asset.fileName,
                }));
                setImages(prev => ({
                    ...prev,
                    shopImages: selectedImages,
                }));
            }
        });
    };

    // Submit form
    const handleSubmit = async (): Promise<void> => {
        try {
            setLoading(true);

            // Validate required fields
            if (!formData.shopname || !formData.contactPerson || !formData.phoneNumber) {
                Alert.alert('Error', 'Please fill in all required fields');
                return;
            }

            // Create FormData
            const submitData = new FormData();
            
            // Add text fields
            submitData.append('shopname', formData.shopname);
            submitData.append('address', JSON.stringify(formData.address));
            submitData.append('about', formData.about);
            submitData.append('contactPerson', formData.contactPerson);
            submitData.append('phoneNumber', formData.phoneNumber);
            submitData.append('hoursOfOperation', JSON.stringify(formData.hoursOfOperation));
            submitData.append('services', JSON.stringify(formData.services));

            // Add contact person image
            if (images.contactPersonImg) {
                submitData.append('contactPersonImg', {
                    uri: images.contactPersonImg.uri,
                    type: images.contactPersonImg.type,
                    name: images.contactPersonImg.fileName || 'contact.jpg',
                } as any);
            }

            // Add shop images
            images.shopImages.forEach((image, index) => {
                submitData.append('shopimage', {
                    uri: image.uri,
                    type: image.type,
                    name: image.fileName || `shop_${index}.jpg`,
                } as any);
            });

            // Make API call
            const response = await fetch('http://localhost:5000/api/users/dry-cleaner', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                },
                body: submitData,
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Dry Cleaner registered successfully!', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            } else {
                Alert.alert('Error', result.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={35} color={colors.brandColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Register Dry Cleaner</Text>
                <View style={{ width: 35 }} />
            </View>

            {/* Shop Basic Info */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Shop Information</Text>
                
                <Text style={styles.label}>Shop Name *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.shopname}
                    onChangeText={(value) => handleInputChange('shopname', value)}
                    placeholder="Enter shop name"
                />

                <Text style={styles.label}>Contact Person *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.contactPerson}
                    onChangeText={(value) => handleInputChange('contactPerson', value)}
                    placeholder="Enter contact person name"
                />

                <Text style={styles.label}>Phone Number *</Text>
                <TextInput
                    style={styles.input}
                    value={formData.phoneNumber}
                    onChangeText={(value) => handleInputChange('phoneNumber', value)}
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                />

                <Text style={styles.label}>About</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    value={formData.about}
                    onChangeText={(value) => handleInputChange('about', value)}
                    placeholder="Describe your dry cleaning service"
                    multiline
                    numberOfLines={3}
                />
            </View>

            {/* Address */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Address</Text>
                
                <Text style={styles.label}>Street</Text>
                <TextInput
                    style={styles.input}
                    value={formData.address.street}
                    onChangeText={(value) => handleInputChange('address.street', value)}
                    placeholder="Enter street address"
                />

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address.city}
                            onChangeText={(value) => handleInputChange('address.city', value)}
                            placeholder="City"
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address.state}
                            onChangeText={(value) => handleInputChange('address.state', value)}
                            placeholder="State"
                        />
                    </View>
                </View>

                <View style={styles.row}>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Zip Code</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address.zipCode}
                            onChangeText={(value) => handleInputChange('address.zipCode', value)}
                            placeholder="Zip Code"
                        />
                    </View>
                    <View style={styles.halfInput}>
                        <Text style={styles.label}>Country</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.address.country}
                            onChangeText={(value) => handleInputChange('address.country', value)}
                            placeholder="Country"
                        />
                    </View>
                </View>
            </View>

            {/* Images */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Images</Text>
                
                <TouchableOpacity style={styles.imageButton} onPress={handleContactImagePick}>
                    <Text style={styles.buttonText}>
                        {images.contactPersonImg ? 'Contact Image Selected' : 'Select Contact Person Image'}
                    </Text>
                </TouchableOpacity>
                
                {images.contactPersonImg && (
                    <Image source={{ uri: images.contactPersonImg.uri }} style={styles.previewImage} />
                )}

                <TouchableOpacity style={styles.imageButton} onPress={handleShopImagesPick}>
                    <Text style={styles.buttonText}>
                        {images.shopImages.length > 0 
                            ? `${images.shopImages.length} Shop Images Selected` 
                            : 'Select Shop Images (Max 4)'}
                    </Text>
                </TouchableOpacity>
                
                <View style={styles.imagePreviewContainer}>
                    {images.shopImages.map((image, index) => (
                        <Image key={index} source={{ uri: image.uri }} style={styles.shopPreviewImage} />
                    ))}
                </View>
            </View>

            {/* Hours of Operation */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Hours of Operation</Text>
                {formData.hoursOfOperation.map((hour, index) => (
                    <View key={index} style={styles.hourRow}>
                        <Text style={styles.dayText}>{hour.day}</Text>
                        <View style={styles.timeInputs}>
                            <TextInput
                                style={styles.timeInput}
                                value={hour.open}
                                onChangeText={(value) => handleHoursChange(index, 'open', value)}
                                placeholder="Open"
                            />
                            <Text style={styles.toText}>to</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={hour.close}
                                onChangeText={(value) => handleHoursChange(index, 'close', value)}
                                placeholder="Close"
                            />
                        </View>
                    </View>
                ))}
            </View>

            {/* Services */}
            <View style={styles.card}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Services</Text>
                    <TouchableOpacity onPress={addService} style={styles.addButton}>
                        <Text style={styles.addButtonText}>+ Add Service</Text>
                    </TouchableOpacity>
                </View>
                
                {formData.services.map((service, index) => (
                    <View key={index} style={styles.serviceCard}>
                        <View style={styles.serviceHeader}>
                            <Text style={styles.serviceTitle}>Service {index + 1}</Text>
                            {formData.services.length > 1 && (
                                <TouchableOpacity onPress={() => removeService(index)}>
                                    <Text style={styles.removeText}>Remove</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        
                        <Text style={styles.label}>Service Name</Text>
                        <TextInput
                            style={styles.input}
                            value={service.name}
                            onChangeText={(value) => handleServiceChange(index, 'name', value)}
                            placeholder="e.g., Shirt Cleaning"
                        />
                        
                        <Text style={styles.label}>Category</Text>
                        <TextInput
                            style={styles.input}
                            value={service.category}
                            onChangeText={(value) => handleServiceChange(index, 'category', value)}
                            placeholder="e.g., Clothes"
                        />
                        
                        <View style={styles.row}>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Price</Text>
                                <TextInput
                                    style={styles.input}
                                    value={service.price?.toString()}
                                    onChangeText={(value) => handleServiceChange(index, 'price', parseInt(value) || 0)}
                                    placeholder="Price"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.halfInput}>
                                <Text style={styles.label}>Starch Level (1-5)</Text>
                                <TextInput
                                    style={styles.input}
                                    value={service.strachLevel?.toString()}
                                    onChangeText={(value) => handleServiceChange(index, 'strachLevel', parseInt(value) || 3)}
                                    placeholder="3"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Submit Button */}
            <TouchableOpacity 
                style={[styles.submitButton, loading && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#FFF" />
                ) : (
                    <Text style={styles.submitButtonText}>Register Dry Cleaner</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(5),
        marginTop: responsiveHeight(8),
        marginBottom: responsiveHeight(2),
    },
    headerTitle: {
        fontSize: responsiveFontSize(2.5),
        color: colors.black,
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#FFF',
        margin: responsiveWidth(5),
        marginVertical: responsiveHeight(1),
        padding: responsiveWidth(4),
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        color: colors.black,
        marginBottom: responsiveHeight(2),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(2),
    },
    label: {
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        marginBottom: responsiveHeight(0.5),
        marginTop: responsiveHeight(1),
    },
    input: {
        backgroundColor: '#F5F5F5',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.lightGray,
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(4),
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
    },
    textArea: {
        height: responsiveHeight(10),
        textAlignVertical: 'top',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfInput: {
        width: '48%',
    },
    imageButton: {
        backgroundColor: colors.brandColor,
        padding: responsiveHeight(1.5),
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: responsiveHeight(1),
    },
    buttonText: {
        color: '#FFF',
        fontSize: responsiveFontSize(1.8),
    },
    previewImage: {
        width: responsiveWidth(20),
        height: responsiveWidth(20),
        borderRadius: 10,
        marginTop: responsiveHeight(1),
    },
    imagePreviewContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveHeight(1),
    },
    shopPreviewImage: {
        width: responsiveWidth(18),
        height: responsiveWidth(18),
        borderRadius: 8,
        margin: responsiveWidth(1),
    },
    hourRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(1),
    },
    dayText: {
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        width: responsiveWidth(20),
    },
    timeInputs: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    timeInput: {
        backgroundColor: '#F5F5F5',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.lightGray,
        paddingVertical: responsiveHeight(1),
        paddingHorizontal: responsiveWidth(2),
        fontSize: responsiveFontSize(1.6),
        color: colors.black,
        width: responsiveWidth(22),
    },
    toText: {
        marginHorizontal: responsiveWidth(2),
        color: colors.gray,
    },
    addButton: {
        backgroundColor: colors.brandColor,
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(1),
        borderRadius: 6,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: responsiveFontSize(1.6),
    },
    serviceCard: {
        backgroundColor: '#F8F9FA',
        padding: responsiveWidth(3),
        borderRadius: 8,
        marginBottom: responsiveHeight(2),
    },
    serviceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(1),
    },
    serviceTitle: {
        fontSize: responsiveFontSize(1.9),
        fontWeight: 'bold',
        color: colors.black,
    },
    removeText: {
        color: '#FF6B6B',
        fontSize: responsiveFontSize(1.6),
    },
    submitButton: {
        backgroundColor: colors.brandColor,
        margin: responsiveWidth(5),
        paddingVertical: responsiveHeight(2),
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: responsiveHeight(5),
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.6,
    },
});

export default DryClean;