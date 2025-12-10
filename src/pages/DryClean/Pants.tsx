import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../assets/color';
import Icon from 'react-native-paper/src/components/Icon';
import { ScrollView } from 'react-native-gesture-handler';

const Pants = () => {
    const navigation = useNavigation();

    // State for Inputs
    const [itemTitle, setItemTitle] = useState('Athletic Pants');
    const [selectedStarch, setSelectedStarch] = useState<number[]>([1, 2, 3]);
    const [washOnly, setWashOnly] = useState<'Yes' | 'No' | null>(null);
    const [selectedServices, setSelectedServices] = useState<string[]>(['Zipper', 'Wash/Fold']);
    const [price, setPrice] = useState('$15');

    // Starch Levels
    const starchLevels = [1, 2, 3, 4];

    // Additional Services
    const additionalServices = ['Zipper', 'Button', 'Wash/Fold'];

    // Toggle Starch Selection
    const toggleStarch = (level: number) => {
        setSelectedStarch(prev =>
            prev.includes(level) ? prev.filter(item => item !== level) : [...prev, level]
        );
    };

    // Toggle Wash Option
    const toggleWashOnly = (option: 'Yes' | 'No') => {
        setWashOnly(option);
    };

    // Toggle Additional Services
    const toggleService = (service: string) => {
        setSelectedServices(prev =>
            prev.includes(service) ? prev.filter(item => item !== service) : [...prev, service]
        );
    };

    // Handle Delete Item
    const handleDelete = () => {
        Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={35} color={colors.brandColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pants</Text>
            </View>
<ScrollView>
            {/* Item Title */}
            <Text style={styles.sectionTitle}>Title of Item</Text>
            <TextInput
                style={styles.input}
                value={itemTitle}
                onChangeText={setItemTitle}
            />

            {/* Starch Levels */}
            <Text style={styles.sectionTitle}>Select Starch Levels Offered</Text>
            <View style={styles.optionContainer}>
                {starchLevels.map(level => (
                    <TouchableOpacity
                        key={level}
                        style={[styles.optionBox, selectedStarch.includes(level) && styles.selectedOption]}
                        onPress={() => toggleStarch(level)}
                    >
                        <Text style={[styles.optionText, selectedStarch.includes(level) && styles.selectedOptionText]}>
                            {level}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Wash Only Options */}
            <Text style={styles.sectionTitle}>Wash Only Options</Text>
            <View style={styles.optionContainer}>
                {['Yes', 'No'].map(option => (
                    <TouchableOpacity
                        key={option}
                        style={[styles.optionBox, washOnly === option && styles.selectedOption]}
                        onPress={() => toggleWashOnly(option as 'Yes' | 'No')}
                    >
                        <Text style={[styles.optionText, washOnly === option && styles.selectedOptionText]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Additional Services */}
            <Text style={styles.sectionTitle}>Additional Services For this Item</Text>
            <View style={styles.optionContainer}>
                {additionalServices.map(service => (
                    <TouchableOpacity
                        key={service}
                        style={[styles.optionBox, selectedServices.includes(service) && styles.selectedOption]}
                        onPress={() => toggleService(service)}
                    >
                        <Text style={[styles.optionText, selectedServices.includes(service) && styles.selectedOptionText]}>
                            {service}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Price */}
            <Text style={styles.sectionTitle}>Price Per Item</Text>
            <TextInput
                style={styles.priceInput}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
            />

            {/* Delete Button */}
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Icon source="delete" size={25} color={colors.gray} />
                <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>

            {/* Apply & Cancel Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.applyButton} onPress={() => console.log('Item Saved')}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
            </View>
            </ScrollView>
        </View>
    );
};

// **Styles**
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
        padding: responsiveWidth(5),
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '20%',
    },
    headerTitle: {
        fontSize: responsiveFontSize(2.5),
        color: colors.black,
        marginLeft: responsiveWidth(5),
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: colors.black,
        marginTop: responsiveHeight(2),
    },
    input: {
        backgroundColor: '#FFF',
        padding: responsiveHeight(1.5),
        borderRadius: 10,
        fontSize: responsiveFontSize(2),
        color: colors.black,
        marginTop: responsiveHeight(1),
        borderBottomWidth: 1,
        borderBottomColor: colors.gray,
    },
    optionContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveHeight(1),
    },
    optionBox: {
        backgroundColor: colors.gray,
        paddingVertical: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(5),
        borderRadius: 10,
        margin: responsiveWidth(1),
    },
    selectedOption: {
        backgroundColor: colors.brandColor,
    },
    optionText: {
        fontSize: responsiveFontSize(2),
        color: '#FFF',
        fontWeight: 'bold',
    },
    selectedOptionText: {
        color: '#FFF',
    },
    priceInput: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        color: colors.brandColor,
        marginTop: responsiveHeight(1),
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginTop: responsiveHeight(2),
    },
    deleteText: {
        color: colors.gray,
        marginLeft: 5,
    },
    buttonContainer: {
        marginTop: responsiveHeight(3),
    },
    applyButton: {
        backgroundColor: colors.brandColor,
        paddingVertical: responsiveHeight(2),
        borderRadius: 30,
        alignItems: 'center',
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
        marginTop: responsiveHeight(2),
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: responsiveFontSize(2),
    },
});

export default Pants;
