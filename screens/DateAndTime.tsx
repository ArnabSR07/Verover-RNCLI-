import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const DateAndTime = () => {
  const [selectedMonth, setSelectedMonth] = useState('November');
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedPickupDate, setSelectedPickupDate] = useState(0);
  const [selectedPickupTime, setSelectedPickupTime] = useState(null);

  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState(0);
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { cleaner } = route.params;

  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const time = [];
  for (let i = 8; i <= 17; i++) {
    time.push(i);
  }
  return (
    <View style={{ flex: 1 }}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={{ color: 'black', fontWeight: 800, fontSize: 20 }}>
          Verover
        </Text>

        <View style={styles.navIcons}>
          <Feather name="search" color="#000" size={24} />
          <Ionicons name="wallet-outline" color="#000" size={24} />
          <MaterialIcons name="notifications-none" color="#000" size={24} />
        </View>
      </View>

      {/* PAGE CONTENT */}
      <ScrollView
        style={{ paddingTop: 70 }}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <View style={{ paddingHorizontal: 10, marginBottom: 50 }}>
          {/* Back & Title */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Location', { cleaner })}
            >
              <AntDesign name="arrowleft" color="orange" size={24} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Schedule Pickup and Delivery</Text>
          </View>

          <Text style={styles.subTitle}>Select Pickup Date & Time</Text>

          {/* PICKUP DATE + MONTH DROPDOWN */}
          <View style={styles.monthRow}>
            <Text style={{ fontSize: 15, marginVertical: 20 }}>
              Pickup Date
            </Text>

            <TouchableOpacity
              style={styles.monthDropdown}
              onPress={() => setShowMonthModal(true)}
            >
              <Text>{selectedMonth}</Text>
              <MaterialIcons name="arrow-drop-down" color="#000" size={26} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              {days.map((day, idx) => {
                const isActive = selectedPickupDate === day;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedPickupDate(day)}
                    style={[
                      styles.date,
                      isActive && { backgroundColor: 'orange' },
                    ]}
                  >
                    <Text
                      style={[
                        { color: isActive ? 'white' : 'black' },
                        { fontWeight: 'semibold' },
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <Text style={{ fontSize: 15, marginVertical: 20 }}>Pickup Time</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              {time.map((item, idx) => {
                const isSelected = item == selectedPickupTime;
                const hour = item > 12 ? item - 12 : item;
                const suffix = item >= 12 ? 'PM' : 'AM';

                return (
                  <TouchableOpacity
                    onPress={() => setSelectedPickupTime(item)}
                    key={idx}
                    style={[
                      styles.time,
                      isSelected && { backgroundColor: 'orange' },
                    ]}
                  >
                    <Text style={{ color: 'white' }}>
                      {hour}:00 {suffix}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <Text style={styles.subTitle}>Select Delivery Date & Time</Text>
          {/* PICKUP DATE + MONTH DROPDOWN */}
          <View style={styles.monthRow}>
            <Text style={{ fontSize: 15, marginVertical: 20 }}>
              Pickup Date
            </Text>

            <TouchableOpacity
              style={styles.monthDropdown}
              onPress={() => setShowMonthModal(true)}
            >
              <Text>{selectedMonth}</Text>
              <MaterialIcons name="arrow-drop-down" color="#000" size={26} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              {days.map((day, idx) => {
                const isActive = selectedDeliveryDate == day;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedDeliveryDate(day)}
                    style={[
                      styles.date,
                      isActive && { backgroundColor: 'orange' },
                    ]}
                  >
                    <Text
                      style={[
                        { color: isActive ? 'white' : 'black' },
                        { fontWeight: 'semibold' },
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <Text style={{ fontSize: 15, marginVertical: 20 }}>
            Delivery Time
          </Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 10,
              }}
            >
              {time.map((item, idx) => {
                const isSelected = item == selectedDeliveryTime;
                const hour = item > 12 ? item - 12 : item;
                const suffix = item >= 12 ? 'PM' : 'AM';

                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedDeliveryTime(item)}
                    style={[
                      styles.time,
                      isSelected && { backgroundColor: 'orange' },
                    ]}
                  >
                    <Text style={{ color: 'white' }}>
                      {hour}:00 {suffix}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </ScrollView>

      {/* MONTH SELECT MODAL */}
      <Modal transparent visible={showMonthModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Month</Text>

            {months.map(m => (
              <TouchableOpacity
                key={m}
                style={styles.monthItem}
                onPress={() => {
                  setSelectedMonth(m);
                  setShowMonthModal(false);
                }}
              >
                <Text style={styles.monthText}>{m}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={() => setShowMonthModal(false)}
              style={styles.closeBtn}
            >
              <Text style={{ color: 'white', fontWeight: '600' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'orange',
            borderRadius: 40,
            paddingVertical: 15,
          }}
          onPress={() => navigation.navigate('Summary', { cleaner })}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DateAndTime;
const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    paddingHorizontal: 20,
    width: '100%',
    marginBottom: 20,
    position: 'absolute',
    top: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 8,
  },

  navIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 10,
    marginVertical: 30,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  subTitle: {
    color: 'gray',
    fontSize: 22,
    fontWeight: 'semibold',
    marginVertical: 30,
  },

  monthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  monthDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingVertical: 5,
  },

  // MODAL STYLES
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 12,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
  },

  monthItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#e8e8e8',
  },

  monthText: {
    fontSize: 20,
  },

  closeBtn: {
    marginTop: 15,
    backgroundColor: 'orange',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  date: {
    height: 50,
    width: 50,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#FFE5B4',
  },
  time: {
    height: 50,
    width: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'gray',
  },
});
