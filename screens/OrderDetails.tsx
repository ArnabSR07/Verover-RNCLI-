import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useCart } from '../context/context';
import OrderCard from './OrderCard';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

const OrderDetails = () => {
  const { cart, total } = useCart();
  const route = useRoute();
  const { cleaner } = route.params;
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1 }}>
      {/* NAVBAR */}
      <View style={styles.navbar}>
        <Text style={{ color: 'black', fontWeight: 800, fontSize: 20 }}>
          Verover
        </Text>

        <View style={styles.navRight}>
          <Feather name="search" color="#000" size={24} />
          <Ionicons name="wallet-outline" color="#000" size={24} />
          <MaterialIcons name="notifications-none" color="#000" size={24} />
        </View>
      </View>

      {/* BACK + TITLE */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.navigate('Schedule',{cleaner})}>
          <AntDesign name="arrowleft" color="orange" size={24} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20 }}>Order Summary</Text>
      </View>

      {/* ORDER SUBTOTAL */}
      <View style={styles.subtotalRow}>
        <Text style={styles.subtotalText}>Order Sub-Total</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'orange' }}>
          ORDER HISTORY
        </Text>
      </View>

      {/* ORDER LIST */}
      <ScrollView style={{ paddingTop: 20 }}>
        <View style={styles.orderContainer}>
          {cart.length === 0 ? (
            <Text style={{ color: 'gray', fontSize: 16 }}>
              Your cart is empty.
            </Text>
          ) : (
            cart.map(item => (
              <OrderCard
                key={item.id}
                id={item.id}
                title={item.name}
                price={item.price}
              />
            ))
          )}
        </View>
      </ScrollView>
      <View style={styles.bottom}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 18 }}>Sub Total</Text>
          <Text style={{ fontSize: 18 }}>${total}.00</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontSize: 18 }}>Fees</Text>
          <Text style={{ fontSize: 18 }}>$15.00</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text
            style={{ fontSize: 18, color: 'orange', fontWeight: 'semibold' }}
          >
            Total Payment (Approx.)
          </Text>
          <Text style={{ fontSize: 18, color: 'orange' }}>
            ${total + 15}.00
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Payment',{cleaner})}
          style={{
            backgroundColor: 'orange',
            borderRadius: 30,
            width: '90%',
            alignSelf: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              textAlign: 'center',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderDetails;

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
    position: 'absolute',
    top: 0,
    zIndex: 10,
    elevation: 8,
  },

  navRight: {
    flexDirection: 'row',
    gap: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    paddingTop: 100,
    paddingHorizontal: 20,
  },

  subtotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 30,
    paddingHorizontal: 20,
  },

  subtotalText: {
    fontSize: 18,
    color: 'gray',
  },

  orderContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '100%',
    flex: 1,
    gap: 10,
  },
});
