import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useCart } from '../context/context';

const ServiceCard = ({title,price}) => {
  const {addToCart,removeFromCart,cart} = useCart();
  
  const [addons, setAddons] = useState({
    zipper: false,
    washFold: false,
  });

  const toggleAddOn = (key) => {
    setAddons({ ...addons, [key]: !addons[key] });
  };

  const id = title;
  const cartItem = cart.find(item => item.id === id);
  const quantity = cartItem?.quantity || 0;

  return (
    <View style={styles.card}>
      
      {/* TOP ROW */}
      <View style={styles.topRow}>
        <View style={{flex:1,gap:5}}>
          <Text style={styles.title}>{title}</Text>
           <Text style={styles.dropdownText}>Wash Only  ▾</Text>
        </View>
        <View style={{flex:1,gap:5}}>
        <Text style={styles.price}>${price}.00</Text>
        <Text style={styles.dropdownText}>Starch Level  ▾</Text>
        </View>
        <View style={styles.qtyBox}>
            <TouchableOpacity
            onPress={() => addToCart({ id, name: title, price })}
          >
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>


           <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity
            onPress={() => removeFromCart(id)}
          >
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SECOND ROW - DROPDOWNS */}
      <View style={styles.dropdownRow}>
       
        
      </View>

      {/* THIRD ROW - CHECKBOXES */}
      <View style={styles.addonRow}>
        <TouchableOpacity style={styles.addonItem} onPress={() => toggleAddOn('zipper')}>
          <View style={styles.checkbox}>
            {addons.zipper && <AntDesign name="check" size={15} color="orange" />}
          </View>
          <Text style={styles.addonLabel}>Button</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addonItem} onPress={() => toggleAddOn('washFold')}>
          <View style={styles.checkbox}>
            {addons.washFold && <AntDesign name="check" size={15} color="orange" />}
          </View>
          <Text style={styles.addonLabel}>Wash & Fold</Text>
        </TouchableOpacity>
       
        

        <TouchableOpacity style={styles.deleteBtn}>
          <Ionicons name="trash" color="#fff" size={18} />
        </TouchableOpacity>
      
      </View>


      
    </View>
  );
};

export default ServiceCard;
const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: 'orange',
  },

  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },

  dropdownText: {
    fontSize: 15,
    color: '#666',
  },

  addonRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 40,
    alignItems:'center',
    justifyContent:'space-between',
    
  },

  addonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1.5,
    borderColor: '#aaa',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addonLabel: {
    fontSize: 15,
    color: '#444',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
  },

  qtyBox: {
    width: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingVertical: 5,
    alignItems: 'center',
  },

  qtyBtn: {
    fontSize: 18,
    fontWeight: '600',
  },

  qtyValue: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 4,
  },

  deleteBtn: {
    height: 38,
    width: 38,
    borderRadius: 20,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
