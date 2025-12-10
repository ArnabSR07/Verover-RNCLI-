import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useCart } from "../context/context";

const OrderCard = ({ id, title, price }) => {
  const { addToCart, removeFromCart, cart } = useCart();

  // Find quantity from cart context
  const cartItem = cart.find((item) => item.id === id);
  const quantity = cartItem?.quantity || 0;

  // Local Add-ons
  const [addons, setAddons] = useState({
    button: false,
    washFold: false,
  });

  const toggleAddOn = (key) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={styles.card}>
      {/* TOP SECTION */}
      <View style={styles.topRow}>
        <View style={{ flex: 1,gap:5 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Wash Only  ▾</Text>
        </View>

        <View style={{ flex: 1,gap:5 }}>
          <Text style={styles.price}>${price}.00</Text>
          <Text style={styles.subtitle}>Starch Level ▾</Text>
        </View>

        {/* QTY BOX */}
        <View style={styles.qtyBox}>
          <TouchableOpacity
            onPress={() => addToCart({ id, name: title, price })}
          >
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>

          <Text style={styles.qtyValue}>{quantity}</Text>

          <TouchableOpacity onPress={() => removeFromCart(id)}>
            <Text style={styles.qtyBtn}>-</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ADDONS SECTION */}
      <View style={styles.addonsRow}>
        <TouchableOpacity
          style={styles.addonItem}
          onPress={() => toggleAddOn("button")}
        >
          <View style={styles.checkbox}>
            {addons.button && (
              <AntDesign name="check" size={15} color="orange" />
            )}
          </View>
          <Text style={styles.addonLabel}>Button</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addonItem}
          onPress={() => toggleAddOn("washFold")}
        >
          <View style={styles.checkbox}>
            {addons.washFold && (
              <AntDesign name="check" size={15} color="orange" />
            )}
          </View>
          <Text style={styles.addonLabel}>Wash & Fold</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn}>
          <Ionicons name="trash" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap:60
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    
  },

  subtitle: {
    color: "#777",
    marginTop: 5,
  },

  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "orange",
    textAlign: "right",
  },

  qtyBox: {
    flexDirection: "column",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  qtyBtn: {
    fontSize: 20,
    fontWeight: "700",
    paddingVertical: 2,
  },

  qtyValue: {
    fontSize: 17,
    fontWeight: "700",
    marginVertical: 4,
  },

  addonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  addonItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#999",
    justifyContent: "center",
    alignItems: "center",
  },

  addonLabel: {
    fontSize: 15,
    color: "#444",
  },

  deleteBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "orange",
    justifyContent: "center",
    alignItems: "center",
  },
});
