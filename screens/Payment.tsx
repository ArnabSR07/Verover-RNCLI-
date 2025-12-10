import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { RadioButton } from 'react-native-paper';
import { useCart } from '../context/context';

const Payment = () => {
  const route = useRoute();
  const [checked, setChecked] = useState('debit');
  const {total} = useCart();
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.navbar}>
        <View>
          <Text style={{ color: 'black', fontWeight: 800, fontSize: 20 }}>
            Verover
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
          }}
        >
          <Feather name="search" color="#000" size={24} />
          <Ionicons name="wallet-outline" color="#000" size={24} />
          <MaterialIcons name="notifications-none" color="#000" size={24} />
        </View>
      </View>
      <View style={{ paddingTop: 70, height: '100%', paddingHorizontal: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: 30,
            marginBottom: 20,
          }}
        >
          <AntDesign name="arrowleft" color="orange" size={24} />
          <Text style={{ fontSize: 20 }}>Payment</Text>
        </View>
        <View style={styles.bill}>
          <View style={styles.text}>
            <Text
              style={{ fontSize: 18, fontWeight: 'semibold', color: 'orange' }}
            >
              PAY FOR
            </Text>
            <Text
              style={{ fontSize: 18, fontWeight: 'semibold', color: 'orange' }}
            >
              #DC58223
            </Text>
          </View>
          <View style={styles.text}>
            <Text style={{ fontSize: 15, fontWeight: 'semibold' }}>
              Sub Total
            </Text>
            <Text style={{ fontSize: 15, fontWeight: 'semibold' }}>
              ${total}.00
            </Text>
          </View>
          <View style={styles.text}>
            <Text style={{ fontSize: 15, fontWeight: 'semibold' }}>Fees</Text>
            <Text style={{ fontSize: 15, fontWeight: 'semibold' }}>
              $15.00
            </Text>
          </View>
          <View style={styles.text}>
            <Text
              style={{ fontSize: 18, fontWeight: 'semibold', color: 'orange' }}
            >
              Total Payment (Approx.)
            </Text>
            <Text
              style={{ fontSize: 18, fontWeight: 'semibold', color: 'orange' }}
            >
              ${total + 15}.00
            </Text>
          </View>
        </View>
        <Text style={{ marginVertical: 20, fontSize: 20 }}>Payment Method</Text>
        <View
          style={{
            flexDirection: 'row',
            gap: 20,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Fontisto name="apple-pay" color="#000" size={36} />
          <Fontisto name="mastercard" color="#000" size={36} />
          <Fontisto name="visa" color="#000" size={36} />
          <FontAwesome name="cc-stripe" color="#000" size={38} />
        </View>
        {/* Payment Options */}
        <View style={styles.options}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 30,
            }}
          >
            {/* Debit Card */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <RadioButton
                value="debit"
                status={checked === 'debit' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('debit')}
                color="orange"
              />
              <Text style={{ fontSize: 16 }}>Debit Card</Text>
            </View>

            {/* Credit Card */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <RadioButton
                value="credit"
                status={checked === 'credit' ? 'checked' : 'unchecked'}
                onPress={() => setChecked('credit')}
                color="orange"
              />
              <Text style={{ fontSize: 16 }}>Credit Card</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Card Holder Name"
          ></TextInput>
          <TextInput style={styles.input} keyboardType='numeric' placeholder="Card Number"></TextInput>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            placeholder="Expires MM/YY"
          ></TextInput>
          <TextInput style={styles.input} keyboardType='numeric' placeholder="CVV"></TextInput>
          <TouchableOpacity
            style={{
              width: '100%',
              borderRadius: 30,
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: 'orange',
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white',textAlign:'center' }}>
              Pay Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Payment;

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
  bill: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    height: 'auto',
  },
  text: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  options: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    gap: 30,
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    height: 'auto',
    marginVertical: 20,
  },
  input: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: '#000', // choose any color
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingVertical: 8,
    backgroundColor: 'transparent',
  },
});
