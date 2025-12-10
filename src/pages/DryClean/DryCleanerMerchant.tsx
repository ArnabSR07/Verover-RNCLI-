import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import colors from '../../assets/color';
import Icon from 'react-native-paper/src/components/Icon';
import CheckBox from '@react-native-community/checkbox';

const DryCleanerMerchant = () => {
    const navigation = useNavigation();

    // Available items (now arranged into 4 rows)
    const availableItems = [
        ['Blanket', 'Blouse/Tops', 'Coat', 'Comforter'],
        ['Duvet Cover', 'Dress', 'Duvet Cover', 'Gloves'],
        ['Jumpsuit', 'Lining', 'Pants', 'Pillowcase'],
        ['Robe', 'Rug', 'Scarf', 'Skirt'],
        ['Suit', 'Sweater', 'Tablecloth', 'Tie'],
    ];

    // State for selected items
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);

    // Toggle item selection
    const toggleSelection = (item: string) => {
        setSelectedItems(prevSelected =>
            prevSelected.includes(item)
                ? prevSelected.filter(selected => selected !== item)
                : [...prevSelected, item]
        );
    };

    // Handle Select All
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedItems([]); // Deselect all
        } else {
            setSelectedItems(availableItems.flat()); // Select all
        }
        setSelectAll(!selectAll);
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

            {/* Card Layout */}
            <View style={styles.cardContainer}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.sectionTitle}>Items You Accept</Text>

                    {/* Items Grid (Divided into 4 Rows) */}
                    {availableItems.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.itemsRow}>
                            {row.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.itemBox,
                                        selectedItems.includes(item) && styles.selectedItem,
                                    ]}
                                    onPress={() => toggleSelection(item)}
                                >
                                    <Text
                                        style={[
                                            styles.itemText,
                                            selectedItems.includes(item) && styles.selectedItemText,
                                        ]}
                                    >
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    ))}

                    {/* Select All Checkbox */}
                    <View style={styles.selectAllContainer}>
                        <Text style={styles.selectAllText}>Select All</Text>
                        <CheckBox
                            value={selectAll}
                            onValueChange={handleSelectAll}
                            tintColors={{ true: colors.brandColor, false: colors.gray }}
                        />
                    </View>
                </ScrollView>

                {/* Buttons */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.applyButton} onPress={() => console.log('Selected Items:', selectedItems)}>
                        <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

// **Styles**
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: responsiveHeight(2),
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: responsiveWidth(90),
        justifyContent: 'flex-start',
        marginBottom: responsiveHeight(2),
        marginTop: '25%',
    },
    headerTitle: {
        fontSize: responsiveFontSize(2.5),
        color: '#FFF',
        marginLeft: responsiveWidth(5),
        fontWeight: 'bold',
    },
    cardContainer: {
        backgroundColor: '#FFF',
        width: responsiveWidth(90),
        borderRadius: 12,
        padding: responsiveWidth(5),
        paddingBottom: responsiveHeight(2),
    },
    sectionTitle: {
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(2),
        color: colors.black,
    },
    itemsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(1),
    },
    itemBox: {
        backgroundColor: colors.gray,
        paddingVertical: responsiveHeight(1.3),
        paddingHorizontal: responsiveWidth(3),
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        width: responsiveWidth(17), // Ensure uniform item width
    },
    selectedItem: {
        backgroundColor: colors.brandColor,
    },
    itemText: {
        fontSize: responsiveFontSize(1),
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    selectedItemText: {
        color: '#FFF',
    },
    selectAllContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: responsiveHeight(3),
    },
    selectAllText: {
        fontSize: responsiveFontSize(2),
        color: colors.black,
    },
    buttonContainer: {
        marginTop: responsiveHeight(12),
    },
    applyButton: {
        backgroundColor: colors.brandColor,
        paddingVertical: responsiveHeight(2),
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: responsiveHeight(1.5),
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
    },
    cancelButtonText: {
        color: '#FFF',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
});

export default DryCleanerMerchant;
