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

const MerOrderHistory = () => {
    const navigation = useNavigation();
    const [filterApplied, setFilterApplied] = useState(false);

    // Sample Order Data
    const activeOrders = [
        { id: 1, orderNumber: '#Drclr58223', status: 'Active Order' },
        { id: 2, orderNumber: '#Drclr58223', status: 'Active Order' },
        { id: 3, orderNumber: '#Drclr58223', status: 'Active Order' },
    ];

    const completedOrders = [
        { id: 4, orderNumber: '#Drclr58223', status: 'Order Completed\nAwaiting Pickup' },
        { id: 5, orderNumber: '#Drclr58223', status: 'Order Completed' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon source="arrow-left" size={35} color={colors.brandColor} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Order History</Text>
                <TouchableOpacity style={styles.filterButton} onPress={() => setFilterApplied(!filterApplied)}>
                    <Icon source="filter" size={22} color="#FFF" />
                    <Text style={styles.filterText}>FILTERS</Text>
                </TouchableOpacity>
            </View>

            {/* Order List */}
            <ScrollView contentContainerStyle={styles.orderList}>
                {/* Active Orders Section */}
                <Text style={styles.sectionTitle}>Active Orders</Text>
                {activeOrders.map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                        <View>
                            <Text style={styles.orderLabel}>Order Number</Text>
                            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                            <Text style={styles.orderStatusActive}>{order.status}</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.detailsText}>Details</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                {/* Completed Orders Section */}
                <Text style={styles.sectionTitle}>Complete Orders</Text>
                {completedOrders.map((order) => (
                    <View key={order.id} style={styles.orderCard}>
                        <View>
                            <Text style={styles.orderLabel}>Order Number</Text>
                            <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                            <Text style={styles.orderStatusCompleted}>{order.status}</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.detailsText}>Details</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* My Dry Cleaner Button */}
            <TouchableOpacity style={styles.dryCleanerButton}>
                <Text style={styles.dryCleanerText}>My Dry Cleaner</Text>
            </TouchableOpacity>
        </View>
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
        marginTop: '25%',
    },
    headerTitle: {
        fontSize: responsiveFontSize(2.5),
        color: colors.black,
        fontWeight: 'bold',
    },
    filterButton: {
        flexDirection: 'row',
        backgroundColor: colors.brandColor,
        borderRadius: 20,
        paddingHorizontal: responsiveWidth(4),
        paddingVertical: responsiveHeight(1),
        alignItems: 'center',
    },
    filterText: {
        color: '#FFF',
        fontSize: responsiveFontSize(1.8),
        marginLeft: 5,
    },
    orderList: {
        paddingHorizontal: responsiveWidth(5),
        paddingBottom: responsiveHeight(10),
    },
    sectionTitle: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: colors.black,
        marginTop: responsiveHeight(2),
    },
    orderCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        padding: responsiveWidth(5),
        borderRadius: 10,
        marginVertical: responsiveHeight(1),
    },
    orderLabel: {
        fontSize: responsiveFontSize(1.8),
        color: colors.gray,
    },
    orderNumber: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        color: colors.black,
    },
    orderStatusActive: {
        fontSize: responsiveFontSize(1.8),
        color: colors.brandColor,
        marginTop: 5,
    },
    orderStatusCompleted: {
        fontSize: responsiveFontSize(1.8),
        color: colors.gray,
        marginTop: 5,
    },
    detailsText: {
        fontSize: responsiveFontSize(1.8),
        color: colors.gray,
        fontWeight: 'bold',
    },
    dryCleanerButton: {
        backgroundColor: colors.brandColor,
        paddingVertical: responsiveHeight(2),
        borderRadius: 30,
        alignItems: 'center',
        position: 'absolute',
        bottom: responsiveHeight(5),
        width: responsiveWidth(80),
        alignSelf: 'center',
    },
    dryCleanerText: {
        color: '#FFF',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
});

export default MerOrderHistory;
