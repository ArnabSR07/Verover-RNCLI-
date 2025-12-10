import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useNavigation, useRoute } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../assets/color';
import Icon from 'react-native-paper/src/components/Icon';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RouteParams {
    dryCleanerId: string;
}

interface HoursData {
    day: string;
    open: string;
    close: string;
}

const DryCleanerAvailability = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { dryCleanerId } = route.params as RouteParams;

    // State Variables
    const [selectedDays, setSelectedDays] = useState<string[]>([]);
    const [selectedStartTime, setSelectedStartTime] = useState<string>('');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('');
    const [selectAll, setSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayAbbreviations = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const startTimes = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'];
    const endTimes = ['04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'];

    // Handle Day Selection
    const toggleDaySelection = (day: string, abbreviation: string) => {
        const dayIndex = days.indexOf(day);
        if (selectedDays.includes(day)) {
            setSelectedDays(selectedDays.filter(d => d !== day));
        } else {
            setSelectedDays([...selectedDays, day]);
        }
    };

    // Handle Time Selection (Single selection for start and end times)
    const selectStartTime = (time: string) => {
        setSelectedStartTime(time);
    };

    const selectEndTime = (time: string) => {
        setSelectedEndTime(time);
    };

    // Handle Select All
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedDays([]);
            setSelectedStartTime('');
            setSelectedEndTime('');
        } else {
            setSelectedDays([...days]);
            setSelectedStartTime(startTimes[0]);
            setSelectedEndTime(endTimes[0]);
        }
        setSelectAll(!selectAll);
    };

    // Validate selections
    const validateSelections = (): boolean => {
        if (selectedDays.length === 0) {
            Alert.alert('Validation Error', 'Please select at least one day.');
            return false;
        }
        if (!selectedStartTime) {
            Alert.alert('Validation Error', 'Please select a start time.');
            return false;
        }
        if (!selectedEndTime) {
            Alert.alert('Validation Error', 'Please select an end time.');
            return false;
        }
        return true;
    };

    // Apply hours to backend
    const applyHours = async () => {
        if (!validateSelections()) return;

        try {
            setLoading(true);

            // Get auth token
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Authentication Error', 'Please log in again.');
                return;
            }

            // Prepare data for backend
            const hoursData: HoursData[] = selectedDays.map(day => ({
                day,
                open: selectedStartTime,
                close: selectedEndTime
            }));

            console.log('Sending hours data:', hoursData);

            // Make API call
            const response = await axios.put(
                `http://localhost:5000/api/users/edit-hours-drycleaner/${dryCleanerId}`,
                hoursData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                Alert.alert(
                    'Success',
                    'Operating hours updated successfully!',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ]
                );
            }
        } catch (error: any) {
            console.error('Error updating hours:', error);
            
            let errorMessage = 'Failed to update operating hours.';
            
            if (error.response) {
                const status = error.response.status;
                const message = error.response.data?.message;
                
                switch (status) {
                    case 401:
                        errorMessage = 'Authentication failed. Please log in again.';
                        break;
                    case 403:
                        errorMessage = 'You are not authorized to edit this dry cleaner.';
                        break;
                    case 404:
                        errorMessage = 'Dry cleaner not found.';
                        break;
                    default:
                        errorMessage = message || errorMessage;
                }
            } else if (error.request) {
                errorMessage = 'Network error. Please check your connection.';
            }
            
            Alert.alert('Error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <StatusBar hidden={false} barStyle="light-content" backgroundColor={colors.black} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={30} color={colors.brandColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Dry Cleaner Merchant Details</Text>
            </View>

            <View style={styles.card}>
                {/* Select Days */}
                <Text style={styles.sectionTitle}>Select Day(s) Of The Week Available</Text>
                <View style={styles.selectionContainer}>
                    {days.map((day, index) => (
                        <TouchableOpacity
                            key={day}
                            style={[styles.selectionBox, selectedDays.includes(day) && styles.selectedBox]}
                            onPress={() => toggleDaySelection(day, dayAbbreviations[index])}
                        >
                            <Text style={[styles.selectionText, selectedDays.includes(day) && styles.selectedText]}>
                                {dayAbbreviations[index]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Select Start Time */}
                <Text style={styles.sectionTitle}>Select Availability Start-Time</Text>
                <View style={styles.selectionContainer}>
                    {startTimes.map(time => (
                        <TouchableOpacity
                            key={time}
                            style={[styles.selectionBox, selectedStartTime === time && styles.selectedBox]}
                            onPress={() => selectStartTime(time)}
                        >
                            <Text style={[styles.selectionText, selectedStartTime === time && styles.selectedText]}>
                                {time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Select End Time */}
                <Text style={styles.sectionTitle}>Select Availability End-Time</Text>
                <View style={styles.selectionContainer}>
                    {endTimes.map(time => (
                        <TouchableOpacity
                            key={time}
                            style={[styles.selectionBox, selectedEndTime === time && styles.selectedBox]}
                            onPress={() => selectEndTime(time)}
                        >
                            <Text style={[styles.selectionText, selectedEndTime === time && styles.selectedText]}>
                                {time}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Select All Option */}
                <View style={styles.selectAllContainer}>
                    <Text style={styles.selectAllText}>Select All</Text>
                    <CheckBox 
                        value={selectAll} 
                        onValueChange={handleSelectAll} 
                        tintColors={{ true: colors.brandColor, false: colors.gray }} 
                    />
                </View>

                {/* Selected Summary */}
                {selectedDays.length > 0 && selectedStartTime && selectedEndTime && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.summaryTitle}>Selected Schedule:</Text>
                        <Text style={styles.summaryText}>
                            Days: {selectedDays.join(', ')}
                        </Text>
                        <Text style={styles.summaryText}>
                            Hours: {selectedStartTime} - {selectedEndTime}
                        </Text>
                    </View>
                )}

                {/* Apply & Cancel Buttons */}
                <TouchableOpacity 
                    style={[styles.applyButton, loading && styles.disabledButton]} 
                    onPress={applyHours}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <Text style={styles.applyText}>Apply</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.cancelButton, loading && styles.disabledButton]} 
                    onPress={() => navigation.goBack()}
                    disabled={loading}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

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
        marginLeft: responsiveWidth(5),
    },
    sectionTitle: {
        fontSize: responsiveFontSize(2),
        color: colors.black,
        marginTop: responsiveHeight(3),
        fontWeight: '600',
    },
    selectionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveHeight(2),
    },
    selectionBox: {
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(5),
        borderRadius: 8,
        marginRight: responsiveWidth(2),
        marginBottom: responsiveHeight(1),
        backgroundColor: colors.gray,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedBox: {
        backgroundColor: colors.brandColor,
        borderColor: colors.brandColor,
    },
    selectionText: {
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        textAlign: 'center',
    },
    selectedText: {
        color: '#FFF',
        fontWeight: '600',
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsiveHeight(2),
        justifyContent: 'space-between',
        paddingHorizontal: responsiveWidth(2),
    },
    selectAllText: {
        fontSize: responsiveFontSize(2),
        color: colors.black,
        fontWeight: '500',
    },
    summaryContainer: {
        backgroundColor: '#f8f9fa',
        padding: responsiveWidth(4),
        borderRadius: 8,
        marginTop: responsiveHeight(2),
        borderLeftWidth: 4,
        borderLeftColor: colors.brandColor,
    },
    summaryTitle: {
        fontSize: responsiveFontSize(1.8),
        color: colors.black,
        fontWeight: '600',
        marginBottom: 5,
    },
    summaryText: {
        fontSize: responsiveFontSize(1.6),
        color: '#666',
        marginBottom: 2,
    },
    applyButton: {
        backgroundColor: colors.brandColor,
        paddingVertical: responsiveHeight(2),
        borderRadius: 30,
        alignItems: 'center',
        marginTop: responsiveHeight(3),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
        marginBottom: responsiveHeight(2),
    },
    cancelText: {
        color: '#FFF',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
    disabledButton: {
        opacity: 0.6,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        marginTop: '5%',
        padding: responsiveWidth(5),
    },
});

export default DryCleanerAvailability;