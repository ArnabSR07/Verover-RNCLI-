import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Switch,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-paper/src/components/Icon';
import colors from '../../assets/color';
import { images } from '../../assets/images/images';
import axios from 'axios';
import { RootState } from '../../components/redux/store';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { PermissionsAndroid, Platform } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

type RootStackParamList = {
  EditDryCleaner: { dryCleaner: DryCleaner };
  AddDryCleaner: undefined;
  Login: undefined;
};

// Define the DryCleaner type based on your backend model
interface DryCleaner {
  _id: string;
  shopname: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  rating: number;
  about: string;
  contactPerson: string;
  phoneNumber: string;
  contactPersonImg: string;
  shopimage: string[];
  hoursOfOperation: Array<{
    day: string;
    open: string;
    close: string;
    _id: string;
  }>;
  services: Array<{
    name: string;
    category: string;
    strachLevel: number;
    washOnly: boolean;
    additionalservice?: string;
    price: number;
    _id: string;
  }>;
  owner: string;
  ownerId?: string; // Optional for backward compatibility
}

// Helper function to check ownership
const isOwner = (cleaner: DryCleaner, currentUserId: string): boolean => {
  const cleanerOwnerId = cleaner.ownerId || cleaner.owner;
  return cleanerOwnerId === currentUserId;
};

// Service Edit Modal Component
const ServiceEditModal = ({ 
  visible, 
  service, 
  onClose, 
  onSave,
  loading 
}: { 
  visible: boolean;
  service: any | null;
  onClose: () => void;
  onSave: (serviceData: any) => void;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    strachLevel: 1,
    washOnly: false,
    additionalservice: '',
    price: 0,
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        category: service.category || '',
        strachLevel: service.strachLevel || 1,
        washOnly: service.washOnly || false,
        additionalservice: service.additionalservice || '',
        price: service.price || 0,
      });
    }
  }, [service]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Service name is required');
      return;
    }
    if (!formData.category.trim()) {
      Alert.alert('Error', 'Category is required');
      return;
    }
    if (formData.price <= 0) {
      Alert.alert('Error', 'Price must be greater than 0');
      return;
    }

    onSave({
      serviceId: service._id,
      ...formData,
    });
  };

  if (!service) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Icon source="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Service</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveButton, loading && styles.disabledButton]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Service Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Enter service name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.category}
              onChangeText={(text) => setFormData({...formData, category: text})}
              placeholder="Enter category"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Starch Level (1-5)</Text>
            <TextInput
              style={styles.textInput}
              value={formData.strachLevel.toString()}
              onChangeText={(text) => {
                const level = parseInt(text) || 1;
                if (level >= 1 && level <= 5) {
                  setFormData({...formData, strachLevel: level});
                }
              }}
              keyboardType="numeric"
              placeholder="1-5"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Price (₹) *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.price.toString()}
              onChangeText={(text) => {
                const price = parseFloat(text) || 0;
                setFormData({...formData, price: price});
              }}
              keyboardType="numeric"
              placeholder="Enter price"
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.inputLabel}>Wash Only</Text>
            <Switch
              value={formData.washOnly}
              onValueChange={(value) => setFormData({...formData, washOnly: value})}
              trackColor={{ false: '#767577', true: '#FF8C00' }}
              thumbColor={formData.washOnly ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Additional Service</Text>
            <TextInput
              style={styles.textInput}
              value={formData.additionalservice}
              onChangeText={(text) => setFormData({...formData, additionalservice: text})}
              placeholder="zipper, button, wash/fold"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Hours Edit Modal Component
const HoursEditModal = ({ 
  visible, 
  hours, 
  onClose, 
  onSave,
  loading 
}: { 
  visible: boolean;
  hours: any[];
  onClose: () => void;
  onSave: (hoursData: any[]) => void;
  loading: boolean;
}) => {
  const [hoursData, setHoursData] = useState<any[]>([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (hours && hours.length > 0) {
      setHoursData(hours);
    } else {
      // Initialize with default hours
      const defaultHours = daysOfWeek.map(day => ({
        day,
        open: '09:00 AM',
        close: '07:00 PM',
      }));
      setHoursData(defaultHours);
    }
  }, [hours]);

  const updateHour = (index: number, field: string, value: string) => {
    const newHours = [...hoursData];
    newHours[index] = { ...newHours[index], [field]: value };
    setHoursData(newHours);
  };

  const handleSave = () => {
    onSave(hoursData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Icon source="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Operating Hours</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveButton, loading && styles.disabledButton]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {hoursData.map((hour, index) => (
            <View key={index} style={styles.hourRow}>
              <Text style={styles.dayLabel}>{hour.day}</Text>
              <View style={styles.timeInputs}>
                <TextInput
                  style={styles.timeInput}
                  value={hour.open}
                  onChangeText={(text) => updateHour(index, 'open', text)}
                  placeholder="09:00 AM"
                />
                <Text style={styles.timeSeparator}>to</Text>
                <TextInput
                  style={styles.timeInput}
                  value={hour.close}
                  onChangeText={(text) => updateHour(index, 'close', text)}
                  placeholder="07:00 PM"
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Profile Edit Modal Component
const ProfileEditModal = ({ 
  visible, 
  cleaner, 
  onClose, 
  onSave,
  loading 
}: { 
  visible: boolean;
  cleaner: DryCleaner | null;
  onClose: () => void;
  onSave: (profileData: any) => void;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState({
    contactPerson: '',
    phoneNumber: '',
    contactPersonImg: '',
  });
  const [imageUploading, setImageUploading] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);
  const [selectedImageData, setSelectedImageData] = useState<any>(null);

  const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (cleaner) {
      setFormData({
        contactPerson: cleaner.contactPerson || '',
        phoneNumber: cleaner.phoneNumber || '',
        contactPersonImg: cleaner.contactPersonImg || '',
      });
      setSelectedImageUri(null);
      setSelectedImageData(null);
    }
  }, [cleaner]);

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Show image picker options
  const showImagePicker = () => {
    Alert.alert(
      'Select Image',
      'Choose an option to select contact person image',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Remove Image',
          onPress: () => removeImage(),
          style: 'destructive',
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  // Open camera
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchCamera(options, handleImageResponse);
  };

  // Open gallery
  const openGallery = () => {
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 800,
      maxHeight: 800,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  // Handle image response
  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorMessage) {
      return;
    }

    if (response.assets && response.assets[0]) {
      const asset = response.assets[0];
      setSelectedImageUri(asset.uri || '');
      setSelectedImageData(asset);
    }
  };

  // Remove image
  const removeImage = () => {
    setSelectedImageUri(null);
    setSelectedImageData(null);
    setFormData({
      ...formData,
      contactPersonImg: '',
    });
  };

  const handleSave = async () => {
    if (!formData.contactPerson.trim()) {
      Alert.alert('Error', 'Contact person name is required');
      return;
    }
    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Phone number is required');
      return;
    }

    if (!cleaner || !authToken) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    try {
      setImageUploading(true);

      // Create FormData for multipart upload
      const formDataUpload = new FormData();
      
      // Add text fields
      formDataUpload.append('contactPerson', formData.contactPerson);
      formDataUpload.append('phoneNumber', formData.phoneNumber);

      // Add image if selected
      if (selectedImageData) {
        formDataUpload.append('contactPersonImg', {
          uri: selectedImageData.uri,
          type: selectedImageData.type,
          name: selectedImageData.fileName || 'contact-person-image.jpg',
        } as any);
      }

      console.log('=== Profile Update Debug ===');
      console.log('Cleaner ID:', cleaner._id);
      console.log('Form Data:', {
        contactPerson: formData.contactPerson,
        phoneNumber: formData.phoneNumber,
        hasImage: !!selectedImageData,
      });

      const response = await axios.put(
        `http://localhost:5000/api/users/edit-profile-drycleaner/${cleaner._id}`,
        formDataUpload,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      console.log('Profile Update Response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Contact information updated successfully');
        
        // Call the parent's onSave with the updated data
        const updatedData = {
          contactPerson: formData.contactPerson,
          phoneNumber: formData.phoneNumber,
          contactPersonImg: response.data.data?.dryCleaner?.contactPersonImg || formData.contactPersonImg,
        };
        
        onSave(updatedData);
        onClose();
      }
    } catch (error: any) {
      console.error('=== Profile Update Error ===');
      console.error('Error updating profile:', error);
      console.error('Error Response:', error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'You can only edit dry cleaners that you own.');
      } else {
        const message = error.response?.data?.message || 'Failed to update contact information';
        Alert.alert('Error', message);
      }
    } finally {
      setImageUploading(false);
    }
  };

  if (!cleaner) return null;

  // Determine which image to show
  const displayImageUri = selectedImageUri || formData.contactPersonImg;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Icon source="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Contact Info</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading || imageUploading}>
            <Text style={[styles.saveButton, (loading || imageUploading) && styles.disabledButton]}>
              {loading || imageUploading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Contact Person Image Section */}
          <View style={styles.imageSection}>
            <Text style={styles.inputLabel}>Contact Person Image</Text>
            <View style={styles.imageContainer}>
              <TouchableOpacity 
                style={styles.imagePickerButton}
                onPress={showImagePicker}
                disabled={imageUploading}
              >
                {displayImageUri ? (
                  <Image
                    source={{ uri: displayImageUri }}
                    style={styles.contactPersonImageLarge}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Icon source="account-plus" size={40} color="#999" />
                    <Text style={styles.placeholderText}>Add Photo</Text>
                  </View>
                )}
                
                {imageUploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="small" color="#FF8C00" />
                  </View>
                )}
                
                {/* Edit icon overlay */}
                <View style={styles.editImageIcon}>
                  <Icon source="camera" size={16} color="#fff" />
                </View>
              </TouchableOpacity>
              
              <Text style={styles.imageHint}>
                Tap to change contact person photo
              </Text>
              
              {selectedImageUri && (
                <Text style={styles.imageSelectedText}>
                  ✓ New image selected. Save to upload.
                </Text>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contact Person *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.contactPerson}
              onChangeText={(text) => setFormData({...formData, contactPerson: text})}
              placeholder="Enter contact person name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData({...formData, phoneNumber: text})}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Shop Image Edit Modal Component - Updated for your backend
const ShopImageEditModal = ({ 
  visible, 
  cleaner, 
  onClose, 
  onSave,
  loading 
}: { 
  visible: boolean;
  cleaner: DryCleaner | null;
  onClose: () => void;
  onSave: (imageData: any) => void;
  loading: boolean;
}) => {
  const [shopImages, setShopImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<any[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);

  const authToken = useSelector((state: RootState) => state.auth.token);

  useEffect(() => {
    if (cleaner) {
      setShopImages(cleaner.shopimage || []);
      setNewImages([]);
      setDeletedImages([]);
    }
  }, [cleaner]);

  // Request camera permission for Android
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to camera to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  // Show image picker options
  const showImagePicker = () => {
    const remainingSlots = 5 - (shopImages.length - deletedImages.length);
    if (newImages.length >= remainingSlots) {
      Alert.alert('Limit Reached', 'You can only have up to 5 shop images total');
      return;
    }

    Alert.alert(
      'Add Shop Image',
      'Choose an option to add shop image',
      [
        {
          text: 'Camera',
          onPress: () => openCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => openGallery(),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
  };

  // Open camera
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Camera permission is required to take photos');
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 800,
    };

    launchCamera(options, handleImageResponse);
  };

  // Open gallery
  const openGallery = () => {
    const remainingSlots = 5 - (shopImages.length - deletedImages.length);
    const availableSlots = remainingSlots - newImages.length;
    
    const options = {
      mediaType: 'photo' as MediaType,
      quality: 0.8,
      maxWidth: 1200,
      maxHeight: 800,
      selectionLimit: availableSlots > 0 ? availableSlots : 1,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  // Handle image response
  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel || response.errorMessage) {
      return;
    }

    if (response.assets && response.assets.length > 0) {
      const remainingSlots = 5 - (shopImages.length - deletedImages.length) - newImages.length;
      const newImageAssets = response.assets
        .filter(asset => asset.uri)
        .slice(0, remainingSlots); // Ensure we don't exceed limit
      
      setNewImages(prev => [...prev, ...newImageAssets]);
    }
  };

  // Remove existing image (mark for deletion)
  const removeExistingImage = (imageUrl: string) => {
    Alert.alert(
      'Remove Image',
      'Are you sure you want to remove this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setDeletedImages(prev => [...prev, imageUrl]);
          }
        }
      ]
    );
  };

  // Remove new image (before upload)
  const removeNewImage = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  // Restore deleted image
  const restoreImage = (imageUrl: string) => {
    setDeletedImages(prev => prev.filter(img => img !== imageUrl));
  };

  const handleSave = async () => {
    if (!cleaner || !authToken) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    try {
      setImageUploading(true);

      // Step 1: Delete images if any
      if (deletedImages.length > 0) {
        for (const imageUrl of deletedImages) {
          try {
            console.log('Deleting image:', imageUrl);
            const deleteResponse = await axios.delete(
              `http://localhost:5000/api/users/delete-drycleaner-shop-image/${cleaner._id}`,
              {
                headers: {
                  'Authorization': `Bearer ${authToken}`,
                  'Content-Type': 'application/json',
                },
                data: { imageUrl }
              }
            );
            console.log('Image deleted successfully');
          } catch (deleteError) {
            console.error('Error deleting image:', deleteError);
            // Continue with other operations even if one delete fails
          }
        }
      }

      // Step 2: Upload new images if any
      if (newImages.length > 0) {
        // Create FormData for multipart upload
        const formData = new FormData();
        
        // Add new images - your backend expects 'shopimage' field name
        newImages.forEach((image, index) => {
          if (image.uri) {
            formData.append('shopimage', {
              uri: image.uri,
              type: image.type || 'image/jpeg',
              name: image.fileName || `shop-image-${index}.jpg`,
            } as any);
          }
        });

        console.log('=== Shop Image Upload Debug ===');
        console.log('Cleaner ID:', cleaner._id);
        console.log('New Images Count:', newImages.length);

        const uploadResponse = await axios.put(
          `http://localhost:5000/api/users/update-drycleaner-shop-images/${cleaner._id}`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Content-Type': 'multipart/form-data',
            }
          }
        );

        console.log('Shop Images Upload Response:', uploadResponse.data);

        if (uploadResponse.data.success) {
          Alert.alert('Success', 'Shop images updated successfully');
          
          // Call the parent's onSave with the updated data
          const updatedData = {
            shopimage: uploadResponse.data.data?.dryCleaner?.shopimage || [],
          };
          
          onSave(updatedData);
        }
      } else if (deletedImages.length > 0) {
        // If only deleting images, still need to refresh
        Alert.alert('Success', 'Shop images updated successfully');
        
        // Calculate remaining images
        const remainingImages = shopImages.filter(img => !deletedImages.includes(img));
        const updatedData = {
          shopimage: remainingImages,
        };
        
        onSave(updatedData);
      } else {
        // No changes made
        Alert.alert('Info', 'No changes made to shop images');
      }
      
      onClose();
      
    } catch (error: any) {
      console.error('=== Shop Images Update Error ===');
      console.error('Error updating shop images:', error);
      console.error('Error Response:', error.response?.data);
      
      if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'You can only edit dry cleaners that you own.');
      } else {
        const message = error.response?.data?.message || 'Failed to update shop images';
        Alert.alert('Error', message);
      }
    } finally {
      setImageUploading(false);
    }
  };

  if (!cleaner) return null;

  // Calculate display counts
  const currentImages = shopImages.filter(img => !deletedImages.includes(img));
  const totalImagesAfterSave = currentImages.length + newImages.length;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Icon source="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Shop Images</Text>
          <TouchableOpacity 
            onPress={handleSave} 
            disabled={loading || imageUploading}
          >
            <Text style={[styles.saveButton, (loading || imageUploading) && styles.disabledButton]}>
              {loading || imageUploading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Image Count Info */}
          <View style={styles.imageCountSection}>
            <Text style={styles.imageCountText}>
              Shop Images ({totalImagesAfterSave}/5)
            </Text>
            <Text style={styles.imageCountSubText}>
              Add up to 5 images to showcase your shop
            </Text>
            {(deletedImages.length > 0 || newImages.length > 0) && (
              <Text style={styles.changesText}>
                {deletedImages.length > 0 && `${deletedImages.length} to remove`}
                {deletedImages.length > 0 && newImages.length > 0 && ' • '}
                {newImages.length > 0 && `${newImages.length} to add`}
              </Text>
            )}
          </View>

          {/* Current Images */}
          {shopImages.length > 0 && (
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>Current Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.imagesRow}>
                  {shopImages.map((imageUrl, index) => {
                    const isDeleted = deletedImages.includes(imageUrl);
                    return (
                      <View key={`existing-${index}`} style={styles.imageContainer}>
                        <Image
                          source={{ uri: imageUrl }}
                          style={[
                            styles.shopImageEdit,
                            isDeleted && styles.deletedImage
                          ]}
                          resizeMode="cover"
                        />
                        
                        {isDeleted ? (
                          <TouchableOpacity
                            style={styles.restoreImageButton}
                            onPress={() => restoreImage(imageUrl)}
                          >
                            <Icon source="restore" size={16} color="#fff" />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.removeImageButton}
                            onPress={() => removeExistingImage(imageUrl)}
                          >
                            <Icon source="close" size={16} color="#fff" />
                          </TouchableOpacity>
                        )}
                        
                        <View style={[
                          styles.imageLabel,
                          isDeleted && styles.deletedImageLabel
                        ]}>
                          <Text style={styles.imageLabelText}>
                            {isDeleted ? 'Will Delete' : 'Current'}
                          </Text>
                        </View>
                        
                        {isDeleted && (
                          <View style={styles.deletedOverlay}>
                            <Icon source="delete" size={24} color="#fff" />
                          </View>
                        )}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </View>
          )}

          {/* New Images */}
          {newImages.length > 0 && (
            <View style={styles.imageSection}>
              <Text style={styles.sectionTitle}>New Images</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.imagesRow}>
                  {newImages.map((image, index) => (
                    <View key={`new-${index}`} style={styles.imageContainer}>
                      <Image
                        source={{ uri: image.uri }}
                        style={styles.shopImageEdit}
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        style={styles.removeImageButton}
                        onPress={() => removeNewImage(index)}
                      >
                        <Icon source="close" size={16} color="#fff" />
                      </TouchableOpacity>
                      <View style={[styles.imageLabel, styles.newImageLabel]}>
                        <Text style={styles.imageLabelText}>New</Text>
                      </View>
                      
                      {imageUploading && (
                        <View style={styles.uploadingOverlay}>
                          <ActivityIndicator size="small" color="#FF8C00" />
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Add Images Section */}
          <View style={styles.addImageSection}>
            {totalImagesAfterSave < 5 ? (
              <TouchableOpacity 
                style={styles.addImageButton}
                onPress={showImagePicker}
                disabled={imageUploading}
              >
                <Icon source="camera-plus" size={40} color="#FF8C00" />
                <Text style={styles.addImageText}>Add Shop Images</Text>
                <Text style={styles.addImageSubText}>
                  Tap to add photos from camera or gallery
                </Text>
                <Text style={styles.slotText}>
                  {5 - totalImagesAfterSave} slot(s) remaining
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.limitReachedContainer}>
                <Icon source="check-circle" size={40} color="#4CAF50" />
                <Text style={styles.limitReachedText}>Image limit reached</Text>
                <Text style={styles.limitReachedSubText}>
                  You have reached the maximum number of images (5)
                </Text>
              </View>
            )}
          </View>

          {/* Tips Section */}
          <View style={styles.tipsSection}>
            <Text style={styles.tipsTitle}>📷 Photo Tips</Text>
            <Text style={styles.tipsText}>
              • Take clear, well-lit photos of your shop{'\n'}
              • Show your storefront, interior, and equipment{'\n'}
              • Avoid blurry or dark images{'\n'}
              • Include photos that showcase cleanliness and professionalism
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Address Edit Modal Component
const AddressEditModal = ({ 
  visible, 
  cleaner, 
  onClose, 
  onSave,
  loading 
}: { 
  visible: boolean;
  cleaner: DryCleaner | null;
  onClose: () => void;
  onSave: (addressData: any) => void;
  loading: boolean;
}) => {
  const [formData, setFormData] = useState({
    shopname: '',
    about: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  useEffect(() => {
    if (cleaner) {
      setFormData({
        shopname: cleaner.shopname || '',
        about: cleaner.about || '',
        address: {
          street: cleaner.address?.street || '',
          city: cleaner.address?.city || '',
          state: cleaner.address?.state || '',
          zipCode: cleaner.address?.zipCode || '',
          country: cleaner.address?.country || '',
        },
      });
    }
  }, [cleaner]);

  const handleSave = () => {
    if (!formData.shopname.trim()) {
      Alert.alert('Error', 'Shop name is required');
      return;
    }

    onSave(formData);
  };

  if (!cleaner) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={onClose}>
            <Icon source="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Edit Shop Details</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            <Text style={[styles.saveButton, loading && styles.disabledButton]}>
              {loading ? 'Saving...' : 'Save'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Shop Name *</Text>
            <TextInput
              style={styles.textInput}
              value={formData.shopname}
              onChangeText={(text) => setFormData({...formData, shopname: text})}
              placeholder="Enter shop name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>About</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={formData.about}
              onChangeText={(text) => setFormData({...formData, about: text})}
              placeholder="Enter shop description"
              multiline
              numberOfLines={4}
            />
          </View>

          <Text style={styles.sectionHeader}>Address</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Street</Text>
            <TextInput
              style={styles.textInput}
              value={formData.address.street}
              onChangeText={(text) => setFormData({
                ...formData, 
                address: {...formData.address, street: text}
              })}
              placeholder="Enter street address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.textInput}
              value={formData.address.city}
              onChangeText={(text) => setFormData({
                ...formData, 
                address: {...formData.address, city: text}
              })}
              placeholder="Enter city"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>State</Text>
            <TextInput
              style={styles.textInput}
              value={formData.address.state}
              onChangeText={(text) => setFormData({
                ...formData, 
                address: {...formData.address, state: text}
              })}
              placeholder="Enter state"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>ZIP Code</Text>
            <TextInput
              style={styles.textInput}
              value={formData.address.zipCode}
              onChangeText={(text) => setFormData({
                ...formData, 
                address: {...formData.address, zipCode: text}
              })}
              placeholder="Enter ZIP code"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Country</Text>
            <TextInput
              style={styles.textInput}
              value={formData.address.country}
              onChangeText={(text) => setFormData({
                ...formData, 
                address: {...formData.address, country: text}
              })}
              placeholder="Enter country"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

// Merchant's Dry Cleaner Card Component
const MerchantCleanerCard = ({ 
  cleaner, 
  onViewDetails, 
  onEdit,
  onDelete,
  currentUserId
}: { 
  cleaner: DryCleaner; 
  onViewDetails: (cleaner: DryCleaner) => void;
  onEdit: (cleaner: DryCleaner) => void;
  onDelete: (cleaner: DryCleaner) => void;
  currentUserId: string;
}) => {
  const canEdit = isOwner(cleaner, currentUserId);

  return (
    <View style={styles.cleanerCard}>
      <TouchableOpacity 
        style={styles.cardContent}
        onPress={() => onViewDetails(cleaner)}
      >
        <View style={styles.iconContainer}>
          <Image
            source={images.washing}
            style={styles.washingIcon}
            resizeMode="cover"
          />
        </View>
        <View style={styles.cleanerInfo}>
          <View style={styles.nameRating}>
            <Text style={styles.cleanerName}>{cleaner.shopname}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.starIcon}>★</Text>
              <Text style={styles.rating}>{cleaner.rating || '0.0'}</Text>
            </View>
          </View>
          <Text style={styles.address}>
            {cleaner.address 
              ? `${cleaner.address.street}, ${cleaner.address.city}, ${cleaner.address.state}`
              : 'Address not available'
            }
          </Text>
          <View style={styles.detailsContainer}>
            <View style={styles.distanceContainer}>
              <Text style={styles.phoneIcon}>📞</Text>
              <Text style={styles.phoneText}>{cleaner.phoneNumber}</Text>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.clockIcon}>🕐</Text>
              <Text style={styles.time}>
                {cleaner.hoursOfOperation && cleaner.hoursOfOperation.length > 0
                  ? `${cleaner.hoursOfOperation[0].open} - ${cleaner.hoursOfOperation[0].close}`
                  : '09:00 AM - 07:00 PM'
                }
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      
      {/* Ownership Status Indicator */}
      {!canEdit && (
        <View style={styles.ownershipIndicator}>
          <Icon source="account-multiple" size={14} color="#666" />
          <Text style={styles.ownershipText}>Other Owner</Text>
        </View>
      )}
      
      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <TouchableOpacity 
          style={[styles.editButton, !canEdit && styles.disabledActionButton]}
          onPress={() => canEdit ? onEdit(cleaner) : Alert.alert('Access Denied', 'You can only edit dry cleaners that you own.')}
          disabled={!canEdit}
        >
          <Icon source="pencil" size={16} color={canEdit ? "#4CAF50" : "#ccc"} />
          <Text style={[styles.editButtonText, !canEdit && styles.disabledActionText]}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.viewDetailsButton}
          onPress={() => onViewDetails(cleaner)}
        >
          <Text style={styles.viewDetailsText}>View Details</Text>
          <Icon source="chevron-right" size={16} color="#FF8C00" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.deleteButton, !canEdit && styles.disabledActionButton]}
          onPress={() => canEdit ? onDelete(cleaner) : Alert.alert('Access Denied', 'You can only delete dry cleaners that you own.')}
          disabled={!canEdit}
        >
          <Icon source="delete" size={16} color={canEdit ? "#f44336" : "#ccc"} />
          <Text style={[styles.deleteButtonText, !canEdit && styles.disabledActionText]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Enhanced Detailed Modal Component with Edit Functionality
const CleanerDetailsModal = ({ 
  cleaner, 
  visible, 
  onClose, 
  onEdit,
  onRefresh,
  currentUserId
}: { 
  cleaner: DryCleaner | null; 
  visible: boolean; 
  onClose: () => void;
  onEdit: (cleaner: DryCleaner) => void;
  onRefresh: () => void;
  currentUserId: string;
}) => {
  const [serviceEditModal, setServiceEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [hoursEditModal, setHoursEditModal] = useState(false);
  const [profileEditModal, setProfileEditModal] = useState(false);
  const [addressEditModal, setAddressEditModal] = useState(false);
  const [shopImageEditModal, setShopImageEditModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // Local state to manage the current cleaner data in the modal
  const [currentCleanerData, setCurrentCleanerData] = useState<DryCleaner | null>(null);

  const authToken = useSelector((state: RootState) => state.auth.token);

  // Update local cleaner data when the prop changes
  useEffect(() => {
    if (cleaner) {
      setCurrentCleanerData(cleaner);
    }
  }, [cleaner]);

  // Check if current user can edit
  const canEdit = currentCleanerData ? isOwner(currentCleanerData, currentUserId) : false;

  const showAccessDeniedAlert = () => {
    Alert.alert(
      'Access Denied', 
      'You can only edit dry cleaners that you own. This dry cleaner belongs to another merchant.',
      [{ text: 'OK' }]
    );
  };

  const handleEditService = (service: any) => {
    if (!canEdit) {
      showAccessDeniedAlert();
      return;
    }
    setSelectedService(service);
    setServiceEditModal(true);
  };

  const handleSaveService = async (serviceData: any) => {
    if (!currentCleanerData || !authToken) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    if (!canEdit) {
      showAccessDeniedAlert();
      return;
    }

    try {
      setLoading(true);
      
      console.log('=== Service Update Debug ===');
      console.log('Cleaner ID:', currentCleanerData._id);
      console.log('Service Data:', serviceData);
      console.log('Can Edit:', canEdit);
      
      const response = await axios.put(
        `http://localhost:5000/api/users/edit-service-drycleaner/${currentCleanerData._id}`,
        serviceData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Service Update Response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Service updated successfully');
        setServiceEditModal(false);
        
        // Update local cleaner data with the updated service
        const updatedServices = currentCleanerData.services.map(service => 
          service._id === serviceData.serviceId 
            ? { ...service, ...serviceData }
            : service
        );
        
        setCurrentCleanerData({
          ...currentCleanerData,
          services: updatedServices
        });
        
        onRefresh();
      }
    } catch (error: any) {
      console.error('=== Service Update Error ===');
      console.error('Error updating service:', error);
      console.error('Error Response:', error.response?.data);
      
      if (error.response?.status === 403) {
        showAccessDeniedAlert();
      } else {
        const message = error.response?.data?.message || 'Failed to update service';
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHours = async (hoursData: any[]) => {
    if (!currentCleanerData || !authToken) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    if (!canEdit) {
      showAccessDeniedAlert();
      return;
    }

    try {
      setLoading(true);
      
      console.log('=== Hours Update Debug ===');
      console.log('Cleaner ID:', currentCleanerData._id);
      console.log('Hours Data:', hoursData);
      console.log('Can Edit:', canEdit);
      
      const response = await axios.put(
        `http://localhost:5000/api/users/edit-hours-drycleaner/${currentCleanerData._id}`,
        hoursData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Hours Update Response:', response.data);

      if (response.data.success) {
        Alert.alert('Success', 'Operating hours updated successfully');
        setHoursEditModal(false);
        
        // Update local cleaner data with the updated hours
        setCurrentCleanerData({
          ...currentCleanerData,
          hoursOfOperation: hoursData
        });
        
        onRefresh();
      }
    } catch (error: any) {
      console.error('=== Hours Update Error ===');
      console.error('Error updating hours:', error);
      console.error('Error Response:', error.response?.data);
      
      if (error.response?.status === 403) {
        showAccessDeniedAlert();
      } else {
        const message = error.response?.data?.message || 'Failed to update operating hours';
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (profileData: any) => {
    if (!currentCleanerData || !authToken) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    if (!canEdit) {
      showAccessDeniedAlert();
      return;
    }

    try {
      setLoading(true);
      
      console.log('=== Profile Update Debug ===');
      console.log('Cleaner ID:', currentCleanerData._id);
      console.log('Can Edit:', canEdit);
      console.log('Profile Data:', profileData);

      const response = await axios.put(
        `http://localhost:5000/api/users/edit-profile-drycleaner/${currentCleanerData._id}`,
        profileData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Contact information updated successfully');
        setProfileEditModal(false);
        
        // Update local cleaner data immediately
        setCurrentCleanerData({
          ...currentCleanerData,
          contactPerson: profileData.contactPerson,
          phoneNumber: profileData.phoneNumber,
          contactPersonImg: profileData.contactPersonImg
        });
        
        onRefresh();
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      if (error.response?.status === 403) {
        showAccessDeniedAlert();
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (addressData: any) => {
    if (!currentCleanerData || !authToken) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    if (!canEdit) {
      showAccessDeniedAlert();
      return;
    }

    try {
      setLoading(true);
      
      console.log('=== Address Update Debug ===');
      console.log('Cleaner ID:', currentCleanerData._id);
      console.log('Can Edit:', canEdit);
      console.log('Address Data:', addressData);
      
      const response = await axios.put(
        `http://localhost:5000/api/users/edit-address-drycleaner/${currentCleanerData._id}`,
        addressData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Shop details updated successfully');
        setAddressEditModal(false);
        
        // Update local cleaner data immediately
        setCurrentCleanerData({
          ...currentCleanerData,
          shopname: addressData.shopname,
          about: addressData.about,
          address: addressData.address
        });
        
        onRefresh();
      }
    } catch (error: any) {
      console.error('=== Address Update Error ===');
      console.error('Error updating address:', error);
      console.error('Error Response:', error.response?.data);
      
      if (error.response?.status === 403) {
        showAccessDeniedAlert();
      } else {
        const message = error.response?.data?.message || 'Failed to update shop details';
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShopImages = async (imageData: any) => {
    if (!currentCleanerData || !authToken) {
      Alert.alert('Error', 'Authentication required');
      return;
    }

    if (!canEdit) {
      showAccessDeniedAlert();
      return;
    }

    try {
      setLoading(true);
      
      console.log('=== Shop Images Update Debug ===');
      console.log('Cleaner ID:', currentCleanerData._id);
      console.log('Can Edit:', canEdit);
      console.log('Image Data:', imageData);
      
      // Update local cleaner data immediately
      setCurrentCleanerData({
        ...currentCleanerData,
        shopimage: imageData.shopimage
      });
      
      setShopImageEditModal(false);
      Alert.alert('Success', 'Shop images updated successfully');
      onRefresh();
      
    } catch (error: any) {
      console.error('=== Shop Images Update Error ===');
      console.error('Error updating shop images:', error);
      
      if (error.response?.status === 403) {
        showAccessDeniedAlert();
      } else {
        const message = error.response?.data?.message || 'Failed to update shop images';
        Alert.alert('Error', message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteShopImage = async (imageUrl: string) => {
    if (!currentCleanerData || !authToken) return;

    if (!canEdit) {
      showAccessDeniedAlert();
      return;
    }

    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await axios.delete(
                `http://localhost:5000/api/users/delete-drycleaner-shop-image/${currentCleanerData._id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json',
                  },
                  data: { imageUrl }
                }
              );

              if (response.data.success) {
                Alert.alert('Success', 'Image deleted successfully');
                
                // Update local cleaner data by removing the deleted image
                const updatedImages = currentCleanerData.shopimage.filter(img => img !== imageUrl);
                setCurrentCleanerData({
                  ...currentCleanerData,
                  shopimage: updatedImages
                });
                
                onRefresh();
              }
            } catch (error: any) {
              console.error('Error deleting image:', error);
              if (error.response?.status === 403) {
                showAccessDeniedAlert();
              } else {
                Alert.alert('Error', 'Failed to delete image');
              }
            }
          }
        }
      ]
    );
  };

  if (!currentCleanerData) return null;

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={onClose}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Icon source="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {canEdit ? 'My Dry Cleaner Details' : 'Dry Cleaner Details'}
            </Text>
            <TouchableOpacity 
              onPress={() => canEdit ? onEdit(currentCleanerData) : showAccessDeniedAlert()}
            >
              <Icon source="pencil" size={24} color={canEdit ? "#FF8C00" : "#ccc"} />
            </TouchableOpacity>
          </View>

          {/* Ownership Status Banner */}
          {!canEdit && (
            <View style={styles.ownershipBanner}>
              <Icon source="information" size={20} color="#FF8C00" />
              <Text style={styles.ownershipBannerText}>
                This dry cleaner belongs to another merchant. You can view details but cannot make changes.
              </Text>
            </View>
          )}

          <ScrollView style={styles.modalContent}>
            {/* Shop Images Section */}
            <View style={styles.detailSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Shop Images</Text>
                <View style={styles.imageActionButtons}>
                  {canEdit && (
                    <TouchableOpacity 
                      onPress={() => setShopImageEditModal(true)}
                      style={styles.editImagesButton}
                    >
                      <Icon source="camera-plus" size={16} color="#FF8C00" />
                      <Text style={styles.editImagesButtonText}>Manage Images</Text>
                    </TouchableOpacity>
                  )}
                  <Text style={styles.subText}>
                    {canEdit ? 'Tap to manage images' : 'View only'}
                  </Text>
                </View>
              </View>
              
              {currentCleanerData.shopimage && currentCleanerData.shopimage.length > 0 ? (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScrollView}>
                  {currentCleanerData.shopimage.map((imageUrl, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.shopImageContainer}
                      onPress={() => canEdit ? handleDeleteShopImage(imageUrl) : null}
                      disabled={!canEdit}
                    >
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.shopImage}
                        resizeMode="cover"
                      />
                      {canEdit && (
                        <View style={styles.deleteImageOverlay}>
                          <Icon source="delete" size={16} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  ))}
                  
                  {/* Add Image Quick Button */}
                  {canEdit && currentCleanerData.shopimage.length < 5 && (
                    <TouchableOpacity 
                      style={styles.addImageQuickButton}
                      onPress={() => setShopImageEditModal(true)}
                    >
                      <Icon source="camera-plus" size={24} color="#FF8C00" />
                      <Text style={styles.addImageQuickText}>Add More</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              ) : (
                <View style={styles.noImagesContainer}>
                  <Icon source="image-off" size={40} color="#ccc" />
                  <Text style={styles.noImagesText}>No images uploaded yet</Text>
                  {canEdit && (
                    <TouchableOpacity 
                      style={styles.addFirstImageButton}
                      onPress={() => setShopImageEditModal(true)}
                    >
                      <Icon source="camera-plus" size={30} color="#FF8C00" />
                      <Text style={styles.addFirstImageText}>Add Shop Images</Text>
                      <Text style={styles.addFirstImageSubText}>Upload up to 5 photos</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Contact Information Section */}
            <View style={styles.detailSection}>
              <View style={styles.sectionTitleRow}>
                <View style={styles.sectionTitleWithImage}>
                  <Text style={styles.sectionTitle}>Contact Information</Text>
                  {currentCleanerData.contactPersonImg && (
                    <Image
                      source={{ uri: currentCleanerData.contactPersonImg }}
                      style={styles.contactPersonImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
                <TouchableOpacity 
                  onPress={() => canEdit ? setProfileEditModal(true) : showAccessDeniedAlert()}
                  disabled={!canEdit}
                >
                  <Icon source="pencil" size={20} color={canEdit ? "#FF8C00" : "#ccc"} />
                </TouchableOpacity>
              </View>
              <View style={styles.contactItem}>
                <Icon source="map-marker" size={20} color="#666" />
                <Text style={styles.contactText}>
                  {currentCleanerData.address 
                    ? `${currentCleanerData.address.street}, ${currentCleanerData.address.city}, ${currentCleanerData.address.state} ${currentCleanerData.address.zipCode}`
                    : 'Address not available'
                  }
                </Text>
              </View>
              <View style={styles.contactItem}>
                <Icon source="phone" size={20} color="#666" />
                <Text style={styles.contactText}>{currentCleanerData.phoneNumber}</Text>
              </View>
              <View style={styles.contactItem}>
                <Icon source="account" size={20} color="#666" />
                <Text style={styles.contactText}>{currentCleanerData.contactPerson}</Text>
              </View>
            </View>

            {/* Operating Hours */}
            <View style={styles.detailSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Operating Hours</Text>
                <TouchableOpacity 
                  onPress={() => canEdit ? setHoursEditModal(true) : showAccessDeniedAlert()}
                  disabled={!canEdit}
                >
                  <Icon source="pencil" size={20} color={canEdit ? "#FF8C00" : "#ccc"} />
                </TouchableOpacity>
              </View>
              {currentCleanerData.hoursOfOperation.map((hours, index) => (
                <View key={index} style={styles.contactItem}>
                  <Icon source="clock" size={20} color="#666" />
                  <Text style={styles.contactText}>
                    {hours.day}: {hours.open === 'Closed' ? 'Closed' : `${hours.open} - ${hours.close}`}
                  </Text>
                </View>
              ))}
            </View>

            {/* Services & Pricing */}
            <View style={styles.detailSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>Services & Pricing</Text>
                <Text style={styles.subText}>
                  {canEdit ? 'Tap to edit service' : 'View only'}
                </Text>
              </View>
              <View style={styles.servicesContainer}>
                {currentCleanerData.services.map((service, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={[styles.serviceTag, !canEdit && styles.disabledServiceTag]}
                    onPress={() => handleEditService(service)}
                    disabled={!canEdit}
                  >
                    <Text style={styles.serviceText}>{service.name}</Text>
                    <Text style={styles.servicePriceText}>₹{service.price}</Text>
                    <Text style={styles.serviceCategoryText}>{service.category}</Text>
                    {canEdit && (
                      <View style={styles.serviceEditIcon}>
                        <Icon source="pencil" size={12} color="#FF8C00" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Description */}
            <View style={styles.detailSection}>
              <View style={styles.sectionTitleRow}>
                <Text style={styles.sectionTitle}>About</Text>
                <TouchableOpacity 
                  onPress={() => canEdit ? setAddressEditModal(true) : showAccessDeniedAlert()}
                  disabled={!canEdit}
                >
                  <Icon source="pencil" size={20} color={canEdit ? "#FF8C00" : "#ccc"} />
                </TouchableOpacity>
              </View>
              <Text style={styles.descriptionText}>
                {currentCleanerData.about || `${currentCleanerData.shopname} is a professional dry cleaning service.`}
              </Text>
            </View>

            {/* Business Metrics */}
            <View style={styles.detailSection}>
              <Text style={styles.sectionTitle}>Business Metrics</Text>
              <View style={styles.metricsContainer}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>15</Text>
                  <Text style={styles.metricLabel}>Active Orders</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>150+</Text>
                  <Text style={styles.metricLabel}>Total Customers</Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricValue}>4.5</Text>
                  <Text style={styles.metricLabel}>Avg Rating</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Action Buttons */}
          {canEdit && (
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.editCleanerButton}
                onPress={() => {
                  onEdit(currentCleanerData);
                  onClose();
                }}
              >
                <Text style={styles.editCleanerButtonText}>Edit All Details</Text>
              </TouchableOpacity>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* All Edit Modals - Only show if user can edit */}
      {canEdit && (
        <>
          {/* Service Edit Modal */}
          <ServiceEditModal
            visible={serviceEditModal}
            service={selectedService}
            onClose={() => setServiceEditModal(false)}
            onSave={handleSaveService}
            loading={loading}
          />

          {/* Hours Edit Modal */}
          <HoursEditModal
            visible={hoursEditModal}
            hours={currentCleanerData.hoursOfOperation}
            onClose={() => setHoursEditModal(false)}
            onSave={handleSaveHours}
            loading={loading}
          />

          {/* Profile Edit Modal */}
          <ProfileEditModal
            visible={profileEditModal}
            cleaner={currentCleanerData}
            onClose={() => setProfileEditModal(false)}
            onSave={handleSaveProfile}
            loading={loading}
          />

          {/* Address Edit Modal */}
          <AddressEditModal
            visible={addressEditModal}
            cleaner={currentCleanerData}
            onClose={() => setAddressEditModal(false)}
            onSave={handleSaveAddress}
            loading={loading}
          />

          {/* Shop Image Edit Modal */}
          <ShopImageEditModal
            visible={shopImageEditModal}
            cleaner={currentCleanerData}
            onClose={() => setShopImageEditModal(false)}
            onSave={handleSaveShopImages}
            loading={loading}
          />
        </>
      )}
    </>
  );
};

const MyDryCleaners = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [dryCleaners, setDryCleaners] = useState<DryCleaner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalCleaner, setModalCleaner] = useState<DryCleaner | null>(null);

  // Get auth token and user info from Redux store
  const authToken = useSelector((state: RootState) => state.auth.token);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Function to verify user permissions
  const verifyUserPermissions = () => {
    if (!authToken) {
      Alert.alert('Authentication Error', 'Please login again.');
      navigation.navigate('Login');
      return false;
    }

    if (!currentUser) {
      Alert.alert('User Error', 'User information not found. Please login again.');
      navigation.navigate('Login');
      return false;
    }

    // Log user info for debugging
    console.log('=== User Verification Debug ===');
    console.log('Current User:', currentUser);
    console.log('User Type:', currentUser.userType);
    console.log('User ID:', currentUser._id);

    if (currentUser.userType !== 'merchant') {
      Alert.alert('Access Denied', 'Only merchants can manage dry cleaners.');
      return false;
    }

    return true;
  };

  // Function to fetch merchant's own dry cleaners from backend
  const fetchMyDryCleaners = async () => {
    try {
      setLoading(true);

      if (!verifyUserPermissions()) {
        return;
      }

      console.log('=== API Call Debug ===');
      console.log('Current User ID:', currentUser?._id);
      console.log('Auth Token exists:', !!authToken);

      const response = await axios.get(
        'http://localhost:5000/api/users/get-own-drycleaner',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      console.log('=== API Response Debug ===');
      console.log('Response Status:', response.status);
      console.log('Response Success:', response.data.success);
      console.log('Response Message:', response.data.message);
      console.log('Dry Cleaners Count:', response.data.data?.dryCleaners?.length || 0);

      if (response.data.success) {
        const cleaners = response.data.data?.dryCleaners || [];
        
        // Since the API returns only owned cleaners, all cleaners should be editable
        const transformedCleaners = cleaners.map((cleaner: any) => ({
          ...cleaner,
          ownerId: cleaner.owner || cleaner.ownerId // Ensure ownerId is set
        }));
        
        setDryCleaners(transformedCleaners);
        console.log('=== Ownership Verification ===');
        console.log('Current User ID:', currentUser?._id);
        
        // Verify all returned cleaners are owned by current user
        transformedCleaners.forEach((cleaner: DryCleaner, index: number) => {
          const cleanerOwnerId = cleaner.ownerId || cleaner.owner;
          const isOwnedByUser = cleanerOwnerId === currentUser?._id;
          console.log(`Cleaner ${index + 1}:`, {
            name: cleaner.shopname,
            cleanerOwnerId,
            currentUserId: currentUser?._id,
            isOwned: isOwnedByUser
          });
          
          if (!isOwnedByUser) {
            console.warn(`⚠️ Cleaner "${cleaner.shopname}" is not owned by current user!`);
          }
        });

        // Update modal cleaner if it's currently open
        if (modalCleaner && modalVisible) {
          const updatedModalCleaner = transformedCleaners.find(c => c._id === modalCleaner._id);
          if (updatedModalCleaner) {
            setModalCleaner(updatedModalCleaner);
          }
        }
      }
    } catch (error: any) {
      console.error('=== API Error Debug ===');
      console.error('Error Status:', error.response?.status);
      console.error('Error Message:', error.response?.data?.message);
      console.error('Full Error:', error);
      
      if (error.response?.status === 401) {
        Alert.alert('Unauthorized', 'Your session has expired. Please login again.');
        navigation.navigate('Login');
      } else if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'You don\'t have permission to view dry cleaners.');
      } else {
        Alert.alert('Error', 'Failed to load dry cleaners. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    fetchMyDryCleaners();
  }, [authToken]);

  // Handle view details
  const handleViewDetails = (cleaner: DryCleaner) => {
    setModalCleaner(cleaner);
    setModalVisible(true);
  };

  // Handle edit cleaner
  const handleEditCleaner = (cleaner: DryCleaner) => {
    if (!isOwner(cleaner, currentUser._id)) {
      Alert.alert('Access Denied', 'You can only edit dry cleaners that you own.');
      return;
    }
    navigation.navigate('EditDryCleaner', { dryCleaner: cleaner });
  };

  // Handle delete cleaner
  const handleDeleteCleaner = (cleaner: DryCleaner) => {
    if (!isOwner(cleaner, currentUser._id)) {
      Alert.alert('Access Denied', 'You can only delete dry cleaners that you own.');
      return;
    }

    Alert.alert(
      'Delete Dry Cleaner',
      `Are you sure you want to delete "${cleaner.shopname}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteDryCleaner(cleaner._id),
        },
      ]
    );
  };

  // Delete dry cleaner function
  const deleteDryCleaner = async (cleanerId: string) => {
    try {
      if (!authToken) {
        Alert.alert('Authentication Error', 'Please login again.');
        navigation.navigate('Login');
        return;
      }

      const response = await axios.delete(
        `http://localhost:5000/api/users/delete-own-drycleaner/${cleanerId}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (response.data.success) {
        Alert.alert('Success', 'Dry cleaner deleted successfully.');
        fetchMyDryCleaners(); // Refresh the list
      }
    } catch (error: any) {
      console.error('Error deleting dry cleaner:', error);
      
      if (error.response?.status === 401) {
        Alert.alert('Unauthorized', 'Your session has expired. Please login again.');
        navigation.navigate('Login');
      } else if (error.response?.status === 403) {
        Alert.alert('Access Denied', 'You can only delete dry cleaners that you own.');
      } else {
        Alert.alert('Error', 'Failed to delete dry cleaner. Please try again.');
      }
    }
  };

  // Handle add new dry cleaner
  const handleAddNewCleaner = () => {
    navigation.navigate('AddDryCleaner');
  };

  // Handle modal close
  const handleModalClose = () => {
    setModalVisible(false);
    setModalCleaner(null);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.brandColor} />
          <Text style={styles.loadingText}>Loading your dry cleaners...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}>
          <Icon source="arrow-left" size={35} color={colors.brandColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Dry Cleaners</Text>
        <TouchableOpacity onPress={handleAddNewCleaner}>
          <Icon source="plus" size={35} color={colors.brandColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>My Dry Cleaners ({dryCleaners.length})</Text>
          <TouchableOpacity onPress={fetchMyDryCleaners}>
            <Text style={styles.seeAll}>REFRESH</Text>
          </TouchableOpacity>
        </View>

        {dryCleaners.map((cleaner) => (
          <MerchantCleanerCard 
            key={cleaner._id}
            cleaner={cleaner} 
            onViewDetails={handleViewDetails}
            onEdit={handleEditCleaner}
            onDelete={handleDeleteCleaner}
            currentUserId={currentUser?._id || ''}
          />
        ))}

        {/* Empty State */}
        {dryCleaners.length === 0 && (
          <View style={styles.emptyContainer}>
            <Icon source="store" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No dry cleaners found</Text>
            <Text style={styles.emptySubText}>Get started by adding your first dry cleaner</Text>
            <TouchableOpacity onPress={handleAddNewCleaner} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add Dry Cleaner</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      <CleanerDetailsModal
        cleaner={modalCleaner}
        visible={modalVisible}
        onClose={handleModalClose}
        onEdit={handleEditCleaner}
        onRefresh={fetchMyDryCleaners}
        currentUserId={currentUser?._id || ''}
      />
    </SafeAreaView>
  );
};

// Cleaned StyleSheet with only the styles that are actually used
// Complete StyleSheet for MyDryCleaners Component
const styles = StyleSheet.create({
  // Base Container Styles
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: 70,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },

  // Popular Section Styles
  popularSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  popularTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000000',
  },
  seeAll: {
    color: '#FF8C00',
    fontSize: 14,
  },

  // Scroll View Styles
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Cleaner Card Styles
  cleanerCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
  },
  
  // Ownership Indicator Styles
  ownershipIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e8e8e8',
    paddingVertical: 8,
  },
  ownershipText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
    fontStyle: 'italic',
  },

  // Action Buttons Container
  actionButtonsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  editButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  viewDetailsText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  deleteButtonText: {
    color: '#f44336',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  disabledActionButton: {
    opacity: 0.5,
  },
  disabledActionText: {
    color: '#ccc',
  },

  // Icon Container Styles
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F99026',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 15,
  },
  washingIcon: {
    width: 19,
    height: 20,
    borderRadius: 5,
  },

  // Cleaner Info Styles
  cleanerInfo: {
    flex: 1,
  },
  nameRating: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  cleanerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    color: '#FF8C00',
    marginRight: 4,
  },
  rating: {
    color: '#FF8C00',
    fontWeight: '600',
  },
  address: {
    color: '#666',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },

  // Details Container Styles
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-end',
  },
  phoneIcon: {
    marginRight: 4,
  },
  phoneText: {
    color: '#666',
    fontSize: 12,
  },
  clockIcon: {
    marginRight: 4,
  },
  time: {
    color: '#666',
    fontSize: 12,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    marginBottom: 8,
    fontWeight: '600',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#FF8C00',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Container Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },

  // Ownership Banner Styles
  ownershipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffeaa7',
  },
  ownershipBannerText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },

  // Detail Section Styles
  detailSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleWithImage: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  // Contact Person Image Styles
  contactPersonImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  contactPersonImageLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF8C00',
  },

  // Contact Item Styles
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 5,
  },
  contactText: {
    color: '#333',
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },

  // Services Container Styles
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#FF8C00',
    minWidth: 120,
    position: 'relative',
  },
  disabledServiceTag: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
  },
  serviceText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '600',
  },
  servicePriceText: {
    color: '#FF8C00',
    fontSize: 12,
    fontWeight: '600',
  },
  serviceCategoryText: {
    color: '#666',
    fontSize: 10,
    fontStyle: 'italic',
  },
  serviceEditIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 2,
  },

  // Description Styles
  descriptionText: {
    color: '#333',
    fontSize: 16,
    lineHeight: 24,
  },

  // Modal Actions Styles
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  editCleanerButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  editCleanerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Image Scroll View Styles
  imageScrollView: {
    marginTop: 10,
  },
  shopImageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  shopImage: {
    width: 150,
    height: 100,
    borderRadius: 8,
  },
  deleteImageOverlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 12,
    padding: 4,
  },

  // Metrics Container Styles
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 12,
  },
  metricItem: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FF8C00',
    marginBottom: 5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },

  // Sub Text Styles
  subText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },

  // Input Group Styles
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Save Button Styles
  saveButton: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    color: '#ccc',
  },

  // Switch Group Styles
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },

  // Section Header Styles
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 10,
  },

  // Hour Row Styles
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  timeInputs: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
    flex: 1,
    marginHorizontal: 5,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },

  // Image Section Styles
  imageSection: {
    marginBottom: 25,
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  imagePickerButton: {
    position: 'relative',
    marginBottom: 10,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f5f5f5',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  editImageIcon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#FF8C00',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 60,
  },
  imageHint: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  imageSelectedText: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 5,
  },

  // Shop Images Modal Styles
  imageCountSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  imageCountText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  imageCountSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  changesText: {
    fontSize: 11,
    color: '#FF8C00',
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '600',
  },
  imagesRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  shopImageEdit: {
    width: 120,
    height: 90,
    borderRadius: 8,
  },
  deletedImage: {
    opacity: 0.5,
  },
  removeImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLabel: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  newImageLabel: {
    backgroundColor: 'rgba(255, 140, 0, 0.8)',
  },
  deletedImageLabel: {
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
  },
  imageLabelText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  deletedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(244, 67, 54, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  // Add Image Section Styles
  addImageSection: {
    marginVertical: 20,
  },
  addImageButton: {
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#fff5e6',
  },
  addImageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
    marginTop: 10,
  },
  addImageSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  slotText: {
    fontSize: 11,
    color: '#FF8C00',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },

  // Limit Reached Container Styles
  limitReachedContainer: {
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
  },
  limitReachedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 10,
  },
  limitReachedSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },

  // Tips Section Styles
  tipsSection: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 10,
  },
  tipsText: {
    fontSize: 12,
    color: '#1565c0',
    lineHeight: 18,
  },

  // Image Action Buttons Styles
  imageActionButtons: {
    alignItems: 'flex-end',
  },
  editImagesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FF8C00',
    marginBottom: 5,
  },
  editImagesButtonText: {
    fontSize: 12,
    color: '#FF8C00',
    fontWeight: '600',
    marginLeft: 4,
  },

  // No Images Container Styles
  noImagesContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  noImagesText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  addFirstImageButton: {
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff5e6',
    minWidth: 200,
  },
  addFirstImageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF8C00',
    marginTop: 10,
  },
  addFirstImageSubText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },

  // Add Image Quick Button Styles
  addImageQuickButton: {
    width: 120,
    height: 100,
    borderWidth: 2,
    borderColor: '#FF8C00',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff5e6',
    marginRight: 10,
  },
  addImageQuickText: {
    fontSize: 12,
    color: '#FF8C00',
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
});
export default MyDryCleaners;