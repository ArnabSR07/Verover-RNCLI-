import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useStripeWrapper } from '../../components/stripeWrapper';
import axiosInstance from '../../api/axios';

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('debit');
  const [cardDetails, setCardDetails] = useState({
    holderName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  // Get data from Redux store
  const authToken = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const order = useSelector((state) => state.user?.order);
  const scheduling = useSelector((state) => state.user?.scheduling);
  const addresses = useSelector((state) => state.user?.addresses);
  
  const subtotal = order?.totalAmount || 0;
  const serviceFees = subtotal * 0.15;
  const deliveryCharge = 250;
  const platformFee = 2;
  const totalAmount = subtotal + serviceFees + deliveryCharge + platformFee;

  const Stripe = useStripeWrapper();

  const handlePayment = async () => {
    if (!order || !order.selectedCleaner) {
      Alert.alert('Error', 'Please select a dry cleaner and add items to your order');
      return;
    }

    if (!scheduling) {
      Alert.alert('Error', 'Please schedule your pickup and delivery times');
      return;
    }

    setLoading(true);
    
    try {
      // Dates with safety checks
      // map month names to numbers
// map month names to numbers
const monthMap: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

function buildISODate(date?: string, month?: string, time?: string) {
  if (!date || !month || !time) return null;

  const year = new Date().getFullYear();
  const monthNum = monthMap[month];
  if (!monthNum) return null;

  // Convert "04:00PM" to 24h format
  let [hourStr, minuteStr] = time.replace(/AM|PM/i, "").split(":");
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);
  const isPM = time.toUpperCase().includes("PM");

  if (isPM && hours < 12) hours += 12;
  if (!isPM && hours === 12) hours = 0;

  // Construct JS Date object directly
  const jsDate = new Date(year, monthNum - 1, Number(date), hours, minutes);

  return jsDate.toISOString();
}

// inside handlePayment:

const scheduledPickupDateTime = buildISODate(
  scheduling?.pickupDate,
  scheduling?.pickupMonth,
  scheduling?.pickupTime
);

const scheduledDeliveryDateTime = buildISODate(
  scheduling?.deliveryDate,
  scheduling?.deliveryMonth,
  scheduling?.deliveryTime
);




      // Create booking with all the data from Redux
      const bookingData = {
        user: user._id,
        dryCleaner: order.selectedCleaner._id,

        pickupAddress: addresses?.home?.fullAddress || 'Default pickup address',
        dropoffAddress:
          addresses?.office?.fullAddress ||
          addresses?.home?.fullAddress ||
          'Default dropoff address',

        orderItems: order.items.map((item) => ({
          itemId: item._id,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          price: item.price,
          starchLevel: item.starchLevel,
          washOnly: item.washOnly,
          options: item.options ? JSON.parse(JSON.stringify(item.options)) : {}, // ✅ ensure serializable
          additionalservice: item.additionalservice,
        })),

        pricing: {
          subtotal,
          serviceFees,
          deliveryCharge,
          platformFee,
          totalAmount,
        },

        isScheduled: true,
        scheduledPickupDateTime,
        scheduledDeliveryDateTime,

        bookingType: 'pickup',
        distance: 10,
        time: 30,
        price: totalAmount,
        status: 'pending',

        paymentMethod: paymentMethod.toUpperCase(),
        message: `Order for ${order.items.length} items from ${order.selectedCleaner.shopname}`,
      };

      console.log('Creating booking with data:', bookingData);

      // Step 1: Create the booking in your backend
      const bookingResponse = await axiosInstance.post(
        '/users/create', // ✅ fixed path (make sure backend matches)
        bookingData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!bookingResponse.data.success) {
        throw new Error(bookingResponse.data.message || 'Failed to create booking');
      }

      const createdBooking = bookingResponse.data.data;
      console.log('Booking created:', createdBooking);

      // Step 2: Initialize Stripe payment with the booking ID
      const paymentIntentResponse = await axiosInstance.post(
        '/users/payment-intent',
        {
          bookingId: createdBooking._id,
          amount: Math.round(totalAmount * 100),
          currency: 'usd',
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!paymentIntentResponse.data.success) {
        throw new Error('Failed to create payment intent');
      }

      const { paymentIntent, ephemeralKey, customerId } =
        paymentIntentResponse.data.data;

      await Stripe.initalizedPaymentSheet(paymentIntent, ephemeralKey, customerId);

      console.log('Opening Stripe payment...');
      const paymentResult = await Stripe.openPay();
      
      if (paymentResult) {
        const confirmResponse = await axiosInstance.post(
          '/users/confirm-payment',
          {
            bookingId: createdBooking._id,
            paymentIntentId: paymentIntent,
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (confirmResponse.data.success) {
          Alert.alert('Success', 'Payment completed successfully! Your booking has been confirmed.', [
            {
              text: 'OK',
              onPress: () => {
                console.log('Payment successful, booking ID:', createdBooking._id);
              },
            },
          ]);
        } else {
          throw new Error('Payment confirmation failed');
        }
      } else {
        await axiosInstance.patch(
          `/users/bookings/${createdBooking._id}`,
          {
            status: 'cancelled',
            cancellationReason: 'Payment cancelled by user',
          },
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        
        Alert.alert('Payment Cancelled', 'Payment was not completed. Your booking has been cancelled.');
      }
    } catch (err) {
      console.log('Payment error:', err);
      const errorMessage =
        err.response?.data?.message || err.message || 'Payment failed';
      Alert.alert('Payment Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const PaymentMethodIcon = ({ type, isSelected, onPress }) => {
    return (
      <TouchableOpacity onPress={onPress} style={{ marginHorizontal: 5 }}>
        <Text>{type}</Text>
      </TouchableOpacity>
    );
  };

  const RadioButton = ({ selected, onPress, label }) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={[styles.radioButton, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Your existing JSX remains the same, just update the Pay Button */}
      
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileContainer}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>👤</Text>
          </View>
          <Text style={styles.brandText}>Vervoer</Text>
        </View>
        <View style={styles.headerIcons}>
          <Text style={styles.headerIcon}>🔍</Text>
          <Text style={styles.headerIcon}>📄</Text>
          <Text style={styles.headerIcon}>🔔</Text>
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Text style={styles.navigationTitle}>Payment</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Payment Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.payForText}>PAY FOR</Text>
            <Text style={styles.orderNumber}>#DC58223</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Amount</Text>
            <Text style={styles.summaryValue}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalValue}>
              ${totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.paymentMethodCard}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.sectionDivider} />
          
          {/* Payment Icons */}
          <View style={styles.paymentIconsContainer}>
            <PaymentMethodIcon type="add" />
            <PaymentMethodIcon type="apple" />
            <PaymentMethodIcon type="master" />
            <PaymentMethodIcon type="visa" />
            <PaymentMethodIcon type="other" />
          </View>

          {/* Card Type Selection */}
          <View style={styles.cardTypeContainer}>
            <RadioButton 
              selected={paymentMethod === 'debit'}
              onPress={() => setPaymentMethod('debit')}
              label="Debit Card"
            />
            <RadioButton 
              selected={paymentMethod === 'credit'}
              onPress={() => setPaymentMethod('credit')}
              label="Credit Card"
            />
          </View>

          {/* Card Input Fields */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Card Holder Name"
              placeholderTextColor="#9ca3af"
              value={cardDetails.holderName}
              onChangeText={(text) => setCardDetails({...cardDetails, holderName: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#9ca3af"
              value={cardDetails.cardNumber}
              onChangeText={(text) => setCardDetails({...cardDetails, cardNumber: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Expires MM/YY"
              placeholderTextColor="#9ca3af"
              value={cardDetails.expiry}
              onChangeText={(text) => setCardDetails({...cardDetails, expiry: text})}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="CVV"
              placeholderTextColor="#9ca3af"
              value={cardDetails.cvv}
              onChangeText={(text) => setCardDetails({...cardDetails, cvv: text})}
              keyboardType="numeric"
              secureTextEntry
            />
          </View>
        </View>

       
      </ScrollView>
      <TouchableOpacity 
        style={[styles.payButton, loading && styles.disabledButton]} 
        activeOpacity={0.8}
        onPress={handlePayment}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : (
          <Text style={styles.payButtonText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f4f6',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 32,
    height: 32,
    backgroundColor: '#fed7aa',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileText: {
    fontSize: 12,
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIcon: {
    fontSize: 18,
  },
  navigation: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  backArrow: {
    fontSize: 20,
    color: '#FF8C00',
    fontWeight: '600',
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  payForText: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '500',
  },
  orderNumber: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 16,
  },
  summaryValue: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f3f4f6',
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  totalLabel: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '500',
  },
  totalValue: {
    color: '#FF8C00',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentMethodCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#14b8a6',
    marginBottom: 20,
  },
  paymentIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  paymentIcon: {
    width: 50,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedPaymentIcon: {
    borderWidth: 2,
    borderColor: '#FF8C00',
  },
  paymentIconText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTypeContainer: {
    flexDirection: 'row',
    marginBottom: 25,
    gap: 30,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#FF8C00',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF8C00',
  },
  radioLabel: {
    fontSize: 16,
    color: '#111827',
  },
  inputContainer: {
    gap: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#ffffff',
  },
  payButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 30,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PaymentPage;