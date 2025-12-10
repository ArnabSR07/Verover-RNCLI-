import React, {useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  Alert,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {images} from '../../assets/images/images';
import type {NavigationProp} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {useSelector, useDispatch} from 'react-redux';
import {useStripeWrapper} from '../../components/stripeWrapper';
import axiosInstance from '../../api/axios';
import {
  removeOrderItem,
  updateItemOptions,
  addOrderItem,
  saveOrderData,
  updateItemQuantity,
} from '../../components/redux/userSlice';

import type {RootState} from '../../components/redux/store';
import type {OrderItem} from '../../components/redux/userSlice';

type RootStackParamList = {
  PurchaseReceipt: undefined;
};

interface GlobalPricing {
  deliveryChargePerKm: number;
  serviceCharge: number;
  platformFee: number;
}

// Helper function to generate unique order number with timestamp
const generateFreshOrderNumber = () => {
  const prefix = 'DCS';
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const randomNum = Math.floor(Math.random() * 900) + 100; // 3-digit random
  return `${prefix}${timestamp}${randomNum}`;
};

// Helper function to generate 4-digit tracking ID
const generateTrackingId = () => {
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  return randomNum.toString();
};

export default function OrderSummaryApp() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const authToken = useSelector((state: RootState) => state.auth?.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const scheduling = useSelector((state: RootState) => state.user?.scheduling);
  const addresses = useSelector((state: RootState) => state.user?.addresses);

  const {
    initializedPaymentSheet,
    openPayment,
    confirmMyPayment,
    loading: stripeLoading,
    isReadyForPayment,
  } = useStripeWrapper();

  // CRITICAL FIX: Use a ref to track payment readiness across re-renders
  const paymentReadyRef = useRef(false);
  const [localPaymentReady, setLocalPaymentReady] = useState(false);

  // Memoize selectors to prevent unnecessary re-renders
  const orderData = useSelector((state: RootState) => {
    const order = state.user?.order;
    if (!order) {
      return null;
    }
    return order;
  });

  // Memoize derived values
  const hasItems = useMemo(() => {
    return orderData?.items && orderData.items.length > 0;
  }, [orderData?.items]);

  const itemsLength = useMemo(() => {
    return orderData?.items?.length || 0;
  }, [orderData?.items]);

  const [showWashOnlyModal, setShowWashOnlyModal] = useState(false);
  const [showStarchLevelModal, setShowStarchLevelModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [globalPricing, setGlobalPricing] = useState<GlobalPricing | null>(
    null,
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completedBookingId, setCompletedBookingId] = useState<string | null>(
    null,
  );

  // Payment Modal State
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('debit');
  const [cardDetails, setCardDetails] = useState({
    holderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [paymentLoading, setPaymentLoading] = useState(false);

  // Order Number and Tracking ID State - DYNAMIC GENERATION
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [trackingId, setTrackingId] = useState<string>('');

  // Generate initial order number and tracking ID on component mount
  useEffect(() => {
    if (!orderNumber) {
      const newOrderNumber = generateFreshOrderNumber();
      const newTrackingId = generateTrackingId();

      setOrderNumber(newOrderNumber);
      setTrackingId(newTrackingId);

      console.log('Generated initial order number:', newOrderNumber);
      console.log('Generated tracking ID:', newTrackingId);
    }
  }, []);

  // Fixed debugging useEffect with Redux totals comparison
  useEffect(() => {
    if (__DEV__) {
      console.log('=== REDUX vs UI DEBUG ===');
      console.log('Redux order exists:', !!orderData);
      console.log('Redux totalAmount:', orderData?.totalAmount || 0);
      console.log('Redux totalItems:', orderData?.totalItems || 0);
      console.log('Items count:', itemsLength);
      console.log(
        'Selected cleaner:',
        orderData?.selectedCleaner?.shopname || 'None',
      );
      console.log('Order Number:', orderNumber);
      console.log('Tracking ID:', trackingId);
      console.log('Payment Ready (Hook):', isReadyForPayment);
      console.log('Payment Ready (Local):', localPaymentReady);
      console.log('Payment Ready (Ref):', paymentReadyRef.current);

      if (orderData?.items && globalPricing) {
        const manualSubtotal = orderData.items.reduce(
          (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
          0,
        );
        console.log('Manual calculation subtotal:', manualSubtotal);
        console.log('Redux stored subtotal:', orderData.totalAmount);
        console.log('Match?', manualSubtotal === orderData.totalAmount);
      }
      console.log('=== END DEBUG ===');
    }
  }, [
    orderData?.totalAmount,
    orderData?.totalItems,
    itemsLength,
    orderData?.selectedCleaner?.shopname,
    globalPricing,
    orderNumber,
    trackingId,
    isReadyForPayment,
    localPaymentReady,
  ]);

  const washOnlyOptions = useMemo(
    () => [
      {label: 'Yes', value: true},
      {label: 'No', value: false},
    ],
    [],
  );

  const starchLevelOptions = useMemo(
    () => [
      {label: 'None', value: 1},
      {label: 'Light', value: 2},
      {label: 'Medium', value: 3},
      {label: 'Heavy', value: 4},
    ],
    [],
  );

  const DELIVERY_DISTANCE_KM = 10;

  const fetchGlobalPricing = useCallback(async () => {
    const defaultPricing = {
      deliveryChargePerKm: 25,
      serviceCharge: 0.15,
      platformFee: 2,
    };

    if (!authToken) {
      console.warn('No auth token available, using default pricing');
      setGlobalPricing(defaultPricing);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:5000/api/users/admin/get-global-pricing',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.ok) {
        const apiResponse = await response.json();
        console.log('Global pricing API response:', apiResponse);

        if (apiResponse.success && apiResponse.data) {
          setGlobalPricing({
            deliveryChargePerKm: apiResponse.data.pricePerKm || 25,
            serviceCharge: 0.15,
            platformFee: 2,
          });
        } else {
          console.warn('API response not in expected format, using defaults');
          setGlobalPricing(defaultPricing);
        }
      } else {
        console.error('Failed to fetch global pricing:', response.status);
        setGlobalPricing(defaultPricing);
      }
    } catch (error) {
      console.error('Error fetching global pricing:', error);
      setGlobalPricing(defaultPricing);
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  useEffect(() => {
    fetchGlobalPricing();
  }, [fetchGlobalPricing]);

  // Enhanced calculations with better error handling
  const calculations = useMemo(() => {
    if (!orderData?.items || !globalPricing) {
      return {
        subtotal: 0,
        serviceFees: 0,
        deliveryCharge: 0,
        platformFee: 0,
        total: 0,
      };
    }

    // Calculate subtotal with better error handling
    const subtotal = orderData.items.reduce((sum, item) => {
      const price = parseFloat(String(item.price || 0));
      const quantity = parseInt(String(item.quantity || 0), 10);

      if (isNaN(price) || isNaN(quantity)) {
        console.warn(
          `Invalid price or quantity for item ${item.name}: price=${item.price}, quantity=${item.quantity}`,
        );
        return sum;
      }

      return sum + price * quantity;
    }, 0);

    const serviceFees = subtotal * globalPricing.serviceCharge;
    const deliveryCharge =
      globalPricing.deliveryChargePerKm * DELIVERY_DISTANCE_KM;
    const platformFee = globalPricing.platformFee;
    const total = subtotal + serviceFees + deliveryCharge + platformFee;

    console.log('💰 Calculations updated:', {
      subtotal: subtotal.toFixed(2),
      serviceFees: serviceFees.toFixed(2),
      deliveryCharge: deliveryCharge.toFixed(2),
      platformFee: platformFee.toFixed(2),
      total: total.toFixed(2),
    });

    return {
      subtotal,
      serviceFees,
      deliveryCharge,
      platformFee,
      total,
    };
  }, [orderData?.items, globalPricing]);

  const handlePayment = async () => {
    if (!orderData || !orderData.selectedCleaner) {
      Alert.alert(
        'Error',
        'Please select a dry cleaner and add items to your order',
      );
      return;
    }

    if (!scheduling) {
      Alert.alert('Error', 'Please schedule your pickup and delivery times');
      return;
    }

    // Generate FRESH order number for this specific payment attempt
    const freshOrderNumber = generateFreshOrderNumber();
    const freshTrackingId = generateTrackingId();

    console.log('🆕 FRESH ORDER NUMBER for payment attempt:', freshOrderNumber);
    setOrderNumber(freshOrderNumber);
    setTrackingId(freshTrackingId);

    setPaymentLoading(true);
    setLocalPaymentReady(false);
    paymentReadyRef.current = false;

    let createdBookingId: string | null = null;
    let currentStep = '';

    try {
      // Step 1: Build booking data
      currentStep = 'Building booking data';
      console.log('🔄 Step 1:', currentStep);

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

        let [hourStr, minuteStr] = time.replace(/AM|PM/i, '').split(':');
        let hours = parseInt(hourStr, 10);
        const minutes = parseInt(minuteStr, 10);
        const isPM = time.toUpperCase().includes('PM');

        if (isPM && hours < 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;

        const jsDate = new Date(
          year,
          monthNum - 1,
          Number(date),
          hours,
          minutes,
        );
        return jsDate.toISOString();
      }

      const scheduledPickupDateTime = buildISODate(
        scheduling?.pickupDate,
        scheduling?.pickupMonth,
        scheduling?.pickupTime,
      );

      const scheduledDeliveryDateTime = buildISODate(
        scheduling?.deliveryDate,
        scheduling?.deliveryMonth,
        scheduling?.deliveryTime,
      );

      // Validate required data
      if (!user?._id) {
        throw new Error('User ID is missing');
      }

      if (!orderData.selectedCleaner?._id) {
        throw new Error('Dry cleaner ID is missing');
      }

      if (!scheduledPickupDateTime || !scheduledDeliveryDateTime) {
        throw new Error('Invalid scheduling dates');
      }

      const bookingData = {
        user: user._id,
        dryCleaner: orderData.selectedCleaner._id,
        orderNumber: freshOrderNumber, // Use fresh order number
        pickupAddress: addresses?.home?.fullAddress || 'Default pickup address',
        dropoffAddress:
          addresses?.office?.fullAddress ||
          addresses?.home?.fullAddress ||
          'Default dropoff address',
        orderItems: orderData.items.map(item => ({
          itemId: item._id || '',
          name: item.name || '',
          category: item.category || 'general',
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          starchLevel: Math.min(Number(item.starchLevel) || 3, 3),
          washOnly: Boolean(item.washOnly),
          options: item.options ? JSON.parse(JSON.stringify(item.options)) : {},
          additionalservice: item.additionalservice || '',
        })),
        pricing: {
          subtotal: Number(calculations.subtotal) || 0,
          serviceFees: Number(calculations.serviceFees) || 0,
          deliveryCharge: Number(calculations.deliveryCharge) || 0,
          platformFee: Number(calculations.platformFee) || 0,
          totalAmount: Number(calculations.total) || 0,
        },
        isScheduled: true,
        scheduledPickupDateTime,
        scheduledDeliveryDateTime,
        bookingType: 'pickup',
        distance: 10,
        time: 30,
        price: Number(calculations.total) || 0,
        status: 'pending',
        paymentMethod: paymentMethod.toUpperCase(),
        message: `Order ${freshOrderNumber} for ${orderData.items.length} items from ${orderData.selectedCleaner.shopname}`,
      };

      console.log('📋 Booking data prepared with FRESH order number:', {
        orderNumber: freshOrderNumber,
        userLength: user._id?.length,
        cleanerId: orderData.selectedCleaner._id,
        itemsCount: orderData.items.length,
        totalAmount: calculations.total,
        hasPickupTime: !!scheduledPickupDateTime,
        hasDeliveryTime: !!scheduledDeliveryDateTime,
      });

      // Step 2: Create the booking
      currentStep = 'Creating booking';
      console.log('🔄 Step 2:', currentStep);

      let bookingResponse;
      try {
        bookingResponse = await axiosInstance.post(
          '/users/create',
          bookingData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
            timeout: 15000,
          },
        );
      } catch (bookingError: any) {
        console.error('❌ Booking creation failed:', {
          status: bookingError.response?.status,
          statusText: bookingError.response?.statusText,
          data: bookingError.response?.data,
          message: bookingError.message,
        });

        if (bookingError.response?.status === 500) {
          throw new Error(
            `Server error during booking creation: ${
              bookingError.response?.data?.message || 'Unknown server error'
            }`,
          );
        } else if (bookingError.response?.status === 400) {
          throw new Error(
            `Invalid booking data: ${
              bookingError.response?.data?.message ||
              'Please check your order details'
            }`,
          );
        } else if (bookingError.response?.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else {
          throw new Error(`Booking creation failed: ${bookingError.message}`);
        }
      }

      if (!bookingResponse.data.success) {
        throw new Error(
          bookingResponse.data.message || 'Failed to create booking',
        );
      }

      const createdBooking = bookingResponse.data.data;
      createdBookingId = createdBooking._id;

      const bookingId = createdBooking._id;
      createdBookingId = bookingId; 
      setCompletedBookingId(bookingId);

      console.log('✅ Booking created successfully:', {
        bookingId: createdBooking._id,
        orderNumber: createdBooking.orderNumber || freshOrderNumber,
      });

      // Step 3: Create payment intent
      currentStep = 'Creating payment intent';
      console.log('🔄 Step 3:', currentStep);

      let paymentIntentResponse;
      try {
        paymentIntentResponse = await axiosInstance.post(
          '/users/payment-intent',
          {
            bookingId: createdBooking._id,
            orderNumber: freshOrderNumber,
            amount: Math.round(calculations.total * 100),
            currency: 'usd',
          },
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
      } catch (paymentError: any) {
        console.error('❌ Payment intent creation failed:', {
          status: paymentError.response?.status,
          data: paymentError.response?.data,
        });

        if (paymentError.response?.status === 500) {
          throw new Error(
            `Payment system error: ${
              paymentError.response?.data?.message ||
              'Stripe configuration issue'
            }`,
          );
        }
        throw new Error(
          `Payment initialization failed: ${paymentError.message}`,
        );
      }

      if (!paymentIntentResponse.data.success) {
        throw new Error('Failed to create payment intent');
      }

      const {paymentIntent, ephemeralKey, customerId, paymentIntentId} =
        paymentIntentResponse.data.data;
      console.log('✅ Payment intent created:', {
        hasPaymentIntent: !!paymentIntent,
        hasEphemeralKey: !!ephemeralKey,
        customerId: customerId?.substring(0, 10) + '...',
        paymentIntentId: paymentIntentId?.substring(0, 10) + '...',
      });

      // Step 4: Initialize payment sheet with custom readiness tracking
      currentStep = 'Initializing payment sheet';
      console.log('🔄 Step 4:', currentStep);

      if (!paymentIntent || !ephemeralKey || !customerId) {
        throw new Error('Missing required payment data from server');
      }

      console.log('🔍 Pre-initialization validation:', {
        hasPaymentIntent: !!paymentIntent,
        hasEphemeralKey: !!ephemeralKey,
        hasCustomerId: !!customerId,
        hasPaymentIntentId: !!paymentIntentId,
        hookIsReady: isReadyForPayment,
        localIsReady: localPaymentReady,
        refIsReady: paymentReadyRef.current,
      });

      const initialized = await initializedPaymentSheet(
        paymentIntent,
        ephemeralKey,
        customerId,
        paymentIntentId,
      );

      if (!initialized) {
        throw new Error(
          'Failed to initialize payment sheet - Stripe configuration issue',
        );
      }

      console.log('✅ Payment sheet initialized');

      // CRITICAL: Set our own readiness tracking
      setLocalPaymentReady(true);
      paymentReadyRef.current = true;

      // Wait for state updates
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('🔍 Post-initialization readiness check:', {
        hookIsReady: isReadyForPayment,
        localIsReady: localPaymentReady,
        refIsReady: paymentReadyRef.current,
      });

      // Use our own readiness tracking instead of relying on the hook's state
      if (!paymentReadyRef.current) {
        console.warn('⚠️ Payment readiness ref not set, waiting longer...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (!paymentReadyRef.current) {
          throw new Error(
            'Payment sheet failed to become ready - please try again',
          );
        }
      }

      // Step 5: Open payment sheet
      currentStep = 'Opening payment sheet';
      console.log('🔄 Step 5:', currentStep);

      console.log('🔍 Final payment readiness check:', {
        hookIsReady: isReadyForPayment,
        localIsReady: localPaymentReady,
        refIsReady: paymentReadyRef.current,
        proceedingWith: 'ref-based readiness',
      });

      let paymentResult;
      try {
        console.log('🔄 About to open payment sheet...');

        if (!openPayment) {
          throw new Error('Payment sheet opening function not available');
        }

        paymentResult = await openPayment();

        console.log('🔍 Payment result received:', {
          result: paymentResult,
          resultType: typeof paymentResult,
          isSuccess: paymentResult === true || paymentResult?.success === true,
          isExplicitCancel: paymentResult === false,
          isError: paymentResult?.error,
        });
      } catch (paymentOpenError: any) {
        console.error('❌ Error opening payment sheet:', {
          message: paymentOpenError.message,
          stack: paymentOpenError.stack,
          name: paymentOpenError.name,
        });

        if (paymentOpenError.message?.includes('cancelled')) {
          throw new Error('Payment was cancelled by user');
        } else if (paymentOpenError.message?.includes('failed')) {
          throw new Error('Payment processing failed - please try again');
        } else {
          throw new Error(
            `Failed to open payment sheet: ${paymentOpenError.message}`,
          );
        }
      }

      // Enhanced result handling
      if (paymentResult === true || paymentResult?.success === true) {
        // Step 6: Confirm payment
        currentStep = 'Confirming payment';
        console.log('🔄 Step 6:', currentStep);

        let confirmResponse;
        try {
          confirmResponse = await axiosInstance.post(
            '/users/confirm-payment',
            {
              bookingId: createdBooking._id,
              orderNumber: freshOrderNumber,
              paymentIntentId: paymentIntentId || paymentIntent,
            },
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
        } catch (confirmError: any) {
          console.error('❌ Payment confirmation failed:', {
            status: confirmError.response?.status,
            data: confirmError.response?.data,
          });
          throw new Error(
            `Payment confirmation failed: ${
              confirmError.response?.data?.message || confirmError.message
            }`,
          );
        }

        if (confirmResponse.data.success) {
          setShowPaymentModal(false);
          setShowSuccessModal(true);
          console.log(
            '✅ Payment completed successfully for order:',
            freshOrderNumber,
          );
        } else {
          throw new Error('Payment confirmation failed');
        }
      } else if (paymentResult === false) {
        // Explicit cancellation
        console.log('❌ Payment explicitly cancelled by user');
        await handleBookingCancellation(createdBookingId, freshOrderNumber);

        Alert.alert(
          'Payment Cancelled',
          `Payment was cancelled for order ${freshOrderNumber}. Your booking has been cancelled.`,
          [{text: 'OK'}],
        );
      } else if (paymentResult?.error) {
        // Payment error
        console.error('❌ Payment error:', paymentResult.error);
        throw new Error(`Payment failed: ${paymentResult.error}`);
      } else {
        // Unknown result
        console.warn('⚠️ Unknown payment result:', paymentResult);
        throw new Error(
          'Payment result unclear - please check your payment status',
        );
      }
    } catch (err: any) {
      console.error('❌ Payment error at step:', currentStep);
      console.error('❌ Full error details:', {
        message: err.message,
        stack: err.stack,
        response: err.response?.data,
        status: err.response?.status,
      });

      // Try to clean up booking if it was created
      if (createdBookingId) {
        console.log('🔄 Attempting cleanup for booking:', createdBookingId);
        await handleBookingCancellation(
          createdBookingId,
          freshOrderNumber,
          `Payment failed at: ${currentStep}`,
        );
      }

      // Show user-friendly error message (only if not user cancellation)
      if (!err.message.includes('cancelled by user')) {
        let errorMessage = 'Payment failed. Please try again.';

        if (err.message.includes('Server error during booking creation')) {
          errorMessage =
            'Unable to process your order. Please check your details and try again.';
        } else if (err.message.includes('Payment system error')) {
          errorMessage =
            'Payment system is temporarily unavailable. Please try again later.';
        } else if (err.message.includes('Authentication failed')) {
          errorMessage = 'Your session has expired. Please log in again.';
        } else if (err.message.includes('Invalid booking data')) {
          errorMessage =
            'Order information is incomplete. Please review your order.';
        } else if (err.message.includes('failed to become ready')) {
          errorMessage =
            'Payment system is not ready. Please wait a moment and try again.';
        }

        Alert.alert(
          'Payment Failed',
          `${errorMessage}\n\nOrder: ${freshOrderNumber}\nStep: ${currentStep}`,
        );
      }
    } finally {
      setPaymentLoading(false);
      setLocalPaymentReady(false);
      paymentReadyRef.current = false;
    }
  };

  // Enhanced booking cancellation (keeping your existing logic)
  const handleBookingCancellation = async (
    bookingId: string,
    orderNumber: string,
    reason: string = 'Payment cancelled by user',
  ) => {
    console.log('🔄 Attempting to cancel booking:', bookingId);

    const strategies = [
      {
        name: 'Standard cancellation endpoint',
        method: 'POST',
        url: '/users/cancel-booking',
        data: {bookingId, orderNumber, reason},
      },
      {
        name: 'Direct booking status update (PATCH)',
        method: 'PATCH',
        url: `/users/bookings/${bookingId}`,
        data: {
          status: 'cancelled',
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
        },
      },
      {
        name: 'Update booking status (PUT)',
        method: 'PUT',
        url: `/users/bookings/${bookingId}/status`,
        data: {status: 'cancelled', reason},
      },
      {
        name: 'Generic update endpoint',
        method: 'POST',
        url: '/users/update-booking',
        data: {
          id: bookingId,
          orderNumber,
          updates: {
            status: 'cancelled',
            cancellationReason: reason,
            cancelledAt: new Date().toISOString(),
          },
        },
      },
      {
        name: 'Simple status update',
        method: 'POST',
        url: '/users/booking-status',
        data: {bookingId, orderNumber, status: 'cancelled', reason},
      },
    ];

    for (const strategy of strategies) {
      try {
        console.log(`🔄 Trying: ${strategy.name}`);

        let response;
        const config = {
          headers: {Authorization: `Bearer ${authToken}`},
          timeout: 5000,
        };

        if (strategy.method === 'PATCH') {
          response = await axiosInstance.patch(
            strategy.url,
            strategy.data,
            config,
          );
        } else if (strategy.method === 'PUT') {
          response = await axiosInstance.put(
            strategy.url,
            strategy.data,
            config,
          );
        } else {
          response = await axiosInstance.post(
            strategy.url,
            strategy.data,
            config,
          );
        }

        if (response.status >= 200 && response.status < 300) {
          console.log(
            `✅ Booking cancelled successfully using: ${strategy.name}`,
          );
          return true;
        }
      } catch (error: any) {
        console.log(`❌ ${strategy.name} failed:`, {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: strategy.url,
        });
      }
    }

    console.log('📋 All automatic cancellation attempts failed');
    console.log('Manual cleanup required for:', {
      bookingId,
      orderNumber,
      reason,
      timestamp: new Date().toISOString(),
    });

    return false;
  };

  // Keep all your existing functions (toggleOption, deleteItem, updateWashOnly, etc.)
  const toggleOption = useCallback(
    (itemId: string, optionName: keyof OrderItem['options']) => {
      const item = orderData?.items.find(i => i._id === itemId);
      if (item) {
        console.log(`🔄 Toggling ${optionName} for item ${item.name}`);
        const newOptions = {
          ...item.options,
          [optionName]: !item.options[optionName],
        };
        dispatch(
          updateItemOptions({
            itemId: itemId,
            options: newOptions,
            itemName: item.name,
          }),
        );
      }
    },
    [orderData?.items, dispatch],
  );

  // Enhanced delete item function with better UX
  const deleteItem = useCallback(
    (id: string) => {
      const item = orderData?.items.find(i => i._id === id);

      Alert.alert(
        'Remove Item',
        `Are you sure you want to remove "${
          item?.name || 'this item'
        }" from your order?`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Remove',
            style: 'destructive',
            onPress: () => {
              console.log(`🗑️ Removing item: ${item?.name} (ID: ${id})`);
              dispatch(removeOrderItem(id));

              Alert.alert(
                'Item Removed',
                `${item?.name || 'Item'} has been removed from your order.`,
                [{text: 'OK'}],
              );
            },
          },
        ],
        {cancelable: true},
      );
    },
    [dispatch, orderData?.items],
  );

  const updateWashOnly = useCallback(
    (value: boolean) => {
      if (selectedItemId) {
        const item = orderData?.items.find(i => i._id === selectedItemId);
        console.log(`🔄 Updating wash only to ${value} for item ${item?.name}`);
        dispatch(
          updateItemOptions({
            itemId: selectedItemId,
            washOnly: value,
            itemName: item?.name,
          }),
        );
        setShowWashOnlyModal(false);
        setSelectedItemId(null);
      }
    },
    [selectedItemId, dispatch, orderData?.items],
  );

  const updateStarchLevel = useCallback(
    (value: number) => {
      if (!selectedItemId) return;

      const itemList = orderData?.items ?? [];
      const item = itemList.find(i => i._id === selectedItemId);

      if (item) {
        console.log(
          `🔄 Updating starch level to ${value} for item ${item.name}`,
        );
        dispatch(
          updateItemOptions({
            itemId: selectedItemId,
            starchLevel: value,
            itemName: item.name,
          }),
        );
      } else {
        console.warn(`⚠️ No item found for id ${selectedItemId}`);
      }

      setShowStarchLevelModal(false);
      setSelectedItemId(null);
    },
    [selectedItemId, dispatch, orderData],
  );

  // Enhanced quantity update function with state protection
  const updateQuantity = useCallback(
    (itemId: string, newQuantity: number) => {
      const item = orderData?.items.find(i => i._id === itemId);

      if (!item) {
        console.error(`Item with ID ${itemId} not found`);
        return;
      }

      const validQuantity = Math.max(0, Math.floor(newQuantity));

      console.log(
        `🔢 Updating quantity from ${item.quantity} to ${validQuantity} for item ${item.name}`,
      );

      if (validQuantity === 0) {
        Alert.alert(
          'Remove Item?',
          `Setting quantity to 0 will remove "${item.name}" from your order. Continue?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                console.log('❌ Quantity update cancelled');
              },
            },
            {
              text: 'Remove Item',
              style: 'destructive',
              onPress: () => {
                console.log(
                  `🗑️ Removing item due to zero quantity: ${item.name}`,
                );
                dispatch(removeOrderItem(itemId));
              },
            },
          ],
          {cancelable: true},
        );
      } else {
        dispatch(
          updateItemQuantity({
            itemId,
            quantity: validQuantity,
            itemName: item.name,
          }),
        );

        setTimeout(() => {
          console.log('🔒 Quantity update protection period ended');
        }, 1000);
      }
    },
    [dispatch, orderData?.items],
  );

  // Quick increment function with feedback
  const incrementQuantity = useCallback(
    (itemId: string) => {
      const item = orderData?.items.find(i => i._id === itemId);
      if (!item) return;

      const currentQuantity = parseInt(String(item.quantity || 0), 10);
      const newQuantity = currentQuantity + 1;

      console.log(
        `➕ Incrementing quantity for ${item.name}: ${currentQuantity} → ${newQuantity}`,
      );

      dispatch(
        updateItemQuantity({
          itemId,
          quantity: newQuantity,
          itemName: item.name,
        }),
      );
    },
    [orderData?.items, dispatch],
  );

  // Quick decrement function with validation
  const decrementQuantity = useCallback(
    (itemId: string) => {
      const item = orderData?.items.find(i => i._id === itemId);
      if (!item) return;

      const currentQuantity = parseInt(String(item.quantity || 0), 10);

      if (currentQuantity <= 1) {
        Alert.alert(
          'Remove Item?',
          `This will remove "${item.name}" from your order. Continue?`,
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Remove',
              style: 'destructive',
              onPress: () => {
                console.log(`➖ Removing item due to decrement: ${item.name}`);
                dispatch(removeOrderItem(itemId));
              },
            },
          ],
          {cancelable: true},
        );
      } else {
        const newQuantity = currentQuantity - 1;
        console.log(
          `➖ Decrementing quantity for ${item.name}: ${currentQuantity} → ${newQuantity}`,
        );

        dispatch(
          updateItemQuantity({
            itemId,
            quantity: newQuantity,
            itemName: item.name,
          }),
        );
      }
    },
    [orderData?.items, dispatch],
  );

  // Helper function to calculate item total with validation
  const getItemTotal = useCallback((item: OrderItem) => {
    const price = parseFloat(String(item.price || 0));
    const quantity = parseInt(String(item.quantity || 0), 10);

    if (isNaN(price) || isNaN(quantity)) {
      console.warn(`Invalid price or quantity for item ${item.name}`);
      return 0;
    }

    return price * quantity;
  }, []);

  const getStarchLevelText = useCallback((level: number) => {
    switch (level) {
      case 1:
        return 'None';
      case 2:
        return 'Light';
      case 3:
        return 'Medium';
      case 4:
        return 'Heavy';
      default:
        return 'Medium';
    }
  }, []);

  const renderAddressText = useCallback((address: any): string => {
    if (!address) return 'No address provided';

    if (typeof address === 'string') {
      return address.trim() || 'No address provided';
    }

    if (typeof address === 'object' && address !== null) {
      const street = address.street || '';
      const city = address.city || '';
      const fullAddress = `${street}, ${city}`
        .replace(/^,\s*|,\s*$/g, '')
        .trim();
      return fullAddress || 'No address provided';
    }

    return 'No address provided';
  }, []);

  const RadioButton = ({selected, onPress, label}) => (
    <TouchableOpacity style={styles.radioContainer} onPress={onPress}>
      <View style={[styles.radioButton, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading order summary...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F7F7FA" />

      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={35} color="#FF8C00" />
        </TouchableOpacity>
        <Text style={styles.title}>Order Summary</Text>
      </View>

      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Order Sub-Total</Text>
        <TouchableOpacity>
          <Text style={styles.subtitle2}>ORDER</Text>
        </TouchableOpacity>
      </View>

      {/* Order Number Display Card */}
      {orderNumber && (
        <View style={styles.orderNumberCard}>
          <Text style={styles.orderNumberLabel}>PAY FOR</Text>
          <Text style={styles.orderNumberValue}>#{orderNumber}</Text>
        </View>
      )}

      {orderData?.selectedCleaner && (
        <View style={styles.cleanerInfoCard}>
          <Text style={styles.cleanerName}>
            {orderData.selectedCleaner.shopname || 'Unknown Cleaner'}
          </Text>
          <Text style={styles.cleanerAddress}>
            {renderAddressText(orderData.selectedCleaner.address)}
          </Text>
          {orderData.selectedCleaner.rating ? (
            <Text style={styles.cleanerRating}>
              {`Rating: ${String(orderData.selectedCleaner.rating)}★`}
            </Text>
          ) : null}
        </View>
      )}

      {!hasItems ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No items in your order</Text>
          <TouchableOpacity
            style={styles.addItemsButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.addItemsButtonText}>Add Items</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.itemsContainer}
            showsVerticalScrollIndicator={false}>
            {orderData?.items?.map(item => (
              <View key={item._id || item.name} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemNameContainer}>
                    <Text style={styles.itemName} numberOfLines={2}>
                      {item.name || 'Unknown Item'}
                    </Text>
                    <Text style={styles.itemSubtotal}>
                      Total: ${getItemTotal(item).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.priceQuantityContainer}>
                    <Text style={styles.itemPrice}>
                      ${parseFloat(String(item.price || 0)).toFixed(2)} each
                    </Text>
                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={[
                          styles.quantityButton,
                          parseInt(String(item.quantity || 0)) <= 1 &&
                            styles.quantityButtonDisabled,
                        ]}
                        onPress={() => decrementQuantity(item._id)}
                        activeOpacity={0.7}
                        disabled={parseInt(String(item.quantity || 0)) <= 0}>
                        <Text
                          style={[
                            styles.quantityButtonText,
                            parseInt(String(item.quantity || 0)) <= 1 &&
                              styles.quantityButtonTextDisabled,
                          ]}>
                          −
                        </Text>
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>
                        {parseInt(String(item.quantity || 0))}
                      </Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => incrementQuantity(item._id)}
                        activeOpacity={0.7}>
                        <Text style={styles.quantityButtonText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.optionsContainer}>
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => {
                        setSelectedItemId(item._id);
                        setShowWashOnlyModal(true);
                      }}>
                      <Text style={styles.dropdownText}>
                        Wash Only: {item.washOnly ? 'Yes' : 'No'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.dropdown}
                      onPress={() => {
                        setSelectedItemId(item._id);
                        setShowStarchLevelModal(true);
                      }}>
                      <Text style={styles.dropdownText}>
                        Starch Level:{' '}
                        {getStarchLevelText(item.starchLevel || 3)}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.checkboxContainer}>
                    {item.options?.zipper !== undefined && (
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          item.options.zipper && styles.checkboxChecked,
                        ]}
                        onPress={() => toggleOption(item._id, 'zipper')}>
                        <View style={styles.checkboxInner}>
                          {item.options.zipper && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.checkboxText}>Zipper</Text>
                      </TouchableOpacity>
                    )}
                    {item.options?.button !== undefined && (
                      <TouchableOpacity
                        style={[
                          styles.checkbox,
                          item.options.button && styles.checkboxChecked,
                        ]}
                        onPress={() => toggleOption(item._id, 'button')}>
                        <View style={styles.checkboxInner}>
                          {item.options.button && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </View>
                        <Text style={styles.checkboxText}>Button</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[
                        styles.checkbox,
                        item.options?.washAndFold && styles.checkboxChecked,
                      ]}
                      onPress={() => toggleOption(item._id, 'washAndFold')}>
                      <View style={styles.checkboxInner}>
                        {item.options?.washAndFold && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </View>
                      <Text style={styles.checkboxText}>Wash & Fold</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem(item._id)}
                    activeOpacity={0.7}>
                    <Icon name="delete" size={20} color="#FF4757" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Sub Total</Text>
              <Text style={styles.summaryValue}>
                ${calculations?.subtotal?.toFixed(2) ?? '0.00'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Service Fees (
                {((globalPricing?.serviceCharge ?? 0.15) * 100).toFixed(0)}%)
              </Text>
              <Text style={styles.summaryValue}>
                ${calculations?.serviceFees?.toFixed(2) ?? '0.00'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Delivery Charge ({DELIVERY_DISTANCE_KM}km @ $
                {globalPricing?.deliveryChargePerKm ?? 25}/km)
              </Text>
              <Text style={styles.summaryValue}>
                ${calculations?.deliveryCharge?.toFixed(2) ?? '0.00'}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Platform Fee</Text>
              <Text style={styles.summaryValue}>
                ${calculations?.platformFee?.toFixed(2) ?? '0.00'}
              </Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Payment</Text>
              <Text style={styles.totalValue}>
                ${calculations?.total?.toFixed(2) ?? '0.00'}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.continueButton}
              onPress={() => setShowPaymentModal(true)}>
              <Text style={styles.continueButtonText}>Place Your Order</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Payment Modal */}
      <Modal
        visible={showPaymentModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPaymentModal(false)}>
        <View style={styles.paymentModalContainer}>
          <View style={styles.paymentModalContent}>
            {/* Payment Modal Header */}
            <View style={styles.paymentModalHeader}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setShowPaymentModal(false)}>
                <Icon name="arrow-back" size={24} color="#FF8C00" />
              </TouchableOpacity>
              <Text style={styles.paymentModalTitle}>Add card</Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.paymentScrollView}>
              {/* Card Information Section */}
              <Text style={styles.sectionLabel}>Card information</Text>

              {/* Card Number Input */}
              <View style={styles.cardInputContainer}>
                <TextInput
                  style={styles.cardNumberInput}
                  placeholder="Card number"
                  placeholderTextColor="#9ca3af"
                  value={cardDetails.cardNumber}
                  onChangeText={text =>
                    setCardDetails({...cardDetails, cardNumber: text})
                  }
                  keyboardType="numeric"
                />
                <View style={styles.cardLogos}>
                  <Text style={styles.cardLogo}>VISA</Text>
                  <Text style={styles.cardLogo}>MC</Text>
                  <Text style={styles.cardLogo}>AMEX</Text>
                  <Text style={styles.cardLogo}>JCB</Text>
                </View>
              </View>

              {/* Expiry and CVC Row */}
              <View style={styles.expiryAndCvcRow}>
                <TextInput
                  style={[styles.cardInput, styles.expiryInput]}
                  placeholder="MM / YY"
                  placeholderTextColor="#9ca3af"
                  value={cardDetails.expiry}
                  onChangeText={text =>
                    setCardDetails({...cardDetails, expiry: text})
                  }
                  keyboardType="numeric"
                />
                <View style={styles.cvcContainer}>
                  <TextInput
                    style={styles.cvcInput}
                    placeholder="CVC"
                    placeholderTextColor="#9ca3af"
                    value={cardDetails.cvv}
                    onChangeText={text =>
                      setCardDetails({...cardDetails, cvv: text})
                    }
                    keyboardType="numeric"
                    secureTextEntry
                  />
                  <Icon name="credit-card" size={16} color="#666" />
                </View>
              </View>

              {/* Billing Address Section */}
              <Text style={styles.sectionLabel}>Billing address</Text>

              <View style={styles.billingAddressContainer}>
                <View style={styles.countrySelector}>
                  <Text style={styles.countryText}>United States</Text>
                  <Icon name="keyboard-arrow-down" size={20} color="#666" />
                </View>

                <TextInput
                  style={styles.zipInput}
                  placeholder="ZIP Code"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
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

              {/* Save Card Details Checkbox */}
              <TouchableOpacity style={styles.saveDetailsContainer}>
                <View style={styles.checkbox}>
                  <View style={styles.checkboxInner} />
                </View>
                <Text style={styles.saveDetailsText}>
                  Save payment details to Vervoer Pvt. Lmt. for future purchases
                </Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Pay Button */}
            <TouchableOpacity
              style={[
                styles.payButton,
                paymentLoading && styles.disabledButton,
              ]}
              activeOpacity={0.8}
              onPress={handlePayment}
              disabled={paymentLoading}>
              {paymentLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#ffffff" />
                  <Text style={styles.loadingText}>Processing...</Text>
                </View>
              ) : (
                <View style={styles.payButtonContent}>
                  <Text style={styles.payButtonText}>
                    Pay ${calculations?.total?.toFixed(2) ?? '0.00'}
                  </Text>
                  <Icon name="lock" size={16} color="#ffffff" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}>
        <View style={styles.successModalOverlay}>
          <View style={styles.successModalContainer}>
            <View style={styles.successModalContent}>
              {/* Checkmark Icon */}
              <View style={styles.successIconContainer}>
                <View style={styles.successIcon}>
                  <Icon name="check" size={28} color="#FFFFFF" />
                </View>
              </View>

              {/* Success Text */}
              <Text style={styles.successTitle}>Submitted Successfully</Text>
              <Text style={styles.successSubtitle}>
                Your Order #{orderNumber} Is Completed
              </Text>

              {/* OK Button */}
              <TouchableOpacity
                style={styles.successButton}
                onPress={() => {
                  setShowSuccessModal(false);
                  // Type assertion to bypass the strict typing temporarily
                  (navigation as any).navigate('OrderReceiptPage', {
                    orderId: completedBookingId,
                    orderNumber: orderNumber,
                    trackingId: trackingId,
                    totalAmount: calculations.total,
                    orderData: {
                      items: orderData?.items,
                      cleaner: orderData?.selectedCleaner,
                      addresses: addresses,
                      scheduling: scheduling,
                    },
                  });
                }}>
                <Text style={styles.successButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Wash Only Modal */}
      <Modal visible={showWashOnlyModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Wash Only</Text>
            {washOnlyOptions.map(option => (
              <TouchableOpacity
                key={String(option.value)}
                style={styles.modalOption}
                onPress={() => updateWashOnly(option.value)}>
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowWashOnlyModal(false);
                setSelectedItemId(null);
              }}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Starch Level Modal */}
      <Modal visible={showStarchLevelModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Starch Level</Text>
            {starchLevelOptions.map(option => (
              <TouchableOpacity
                key={String(option.value)}
                style={styles.modalOption}
                onPress={() => updateStarchLevel(option.value)}>
                <Text style={styles.modalOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                setShowStarchLevelModal(false);
                setSelectedItemId(null);
              }}>
              <Text style={styles.modalCloseButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FA',
    paddingTop: 60,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
    top: 29,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000000',
    marginLeft: 15,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: -20,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '300',
    color: '#707070',
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF8C00',
  },
  // 🆕 Order Number Card Styles
  orderNumberCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE4B5',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderNumberLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
  },
  orderNumberValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF8C00',
    letterSpacing: 1,
  },
  cleanerInfoCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cleanerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  cleanerAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cleanerRating: {
    fontSize: 14,
    color: '#F99026',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  addItemsButton: {
    backgroundColor: '#F99026',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addItemsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  itemsContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: -10,
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  itemNameContainer: {
    flex: 1,
    marginRight: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 5,
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F99026',
  },
  priceQuantityContainer: {
    alignItems: 'flex-end',
    minWidth: 120,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F99026',
    marginBottom: 8,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginHorizontal: 2,
  },
  quantityButtonDisabled: {
    backgroundColor: '#F0F0F0',
    shadowOpacity: 0.05,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  quantityButtonTextDisabled: {
    color: '#999',
  },
  quantityText: {
    fontSize: 16,
    color: '#333',
    marginHorizontal: 15,
    minWidth: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  optionsContainer: {
    gap: 15,
    position: 'relative',
  },
  dropdownContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  dropdown: {
    flex: 1,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 44,
    justifyContent: 'center',
  },
  dropdownText: {
    color: '#666',
    fontSize: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    minHeight: 40,
  },
  checkboxInner: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: '#F5F5F5',
    borderRadius: 6,
  },
  checkmark: {
    color: '#FF8C00',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxText: {
    color: '#666',
    fontSize: 14,
  },
  deleteButton: {
    position: 'absolute',
    right: 20,
    top: 55,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summary: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'right',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingVertical: 12,
    marginTop: 8,
    borderTopWidth: 2,
    borderTopColor: '#F99026',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#F99026',
    textAlign: 'right',
  },
  continueButton: {
    backgroundColor: '#F99026',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#F99026',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Payment Modal Styles
  paymentModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  paymentModalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingTop: 20,
  },
  paymentModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  paymentModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  paymentScrollView: {
    paddingHorizontal: 20,
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    color: '#CCC',
    marginBottom: 15,
    marginTop: 10,
  },
  cardInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  cardNumberInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 8,
  },
  cardLogos: {
    flexDirection: 'row',
    gap: 8,
  },
  cardLogo: {
    color: '#CCC',
    fontSize: 12,
    fontWeight: '600',
    backgroundColor: '#444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  expiryAndCvcRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  cardInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#FFF',
    fontSize: 16,
  },
  expiryInput: {
    flex: 1,
  },
  cvcContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  cvcInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 16,
    paddingVertical: 3,
  },
  billingAddressContainer: {
    gap: 15,
    marginBottom: 20,
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  countryText: {
    color: '#FFF',
    fontSize: 16,
  },
  zipInput: {
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 15,
    color: '#FFF',
    fontSize: 16,
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
    borderColor: '#666',
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
    color: '#FFF',
  },
  saveDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 30,
  },
  saveDetailsText: {
    color: '#CCC',
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  payButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 18,
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  payButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },

  // Regular Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalCloseButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#FF4757',
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  modalCloseButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },

  // Success Modal Styles (cleaned up - no duplicates)
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successModalContainer: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  successModalContent: {
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 25,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF8C00',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF8C00',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  successButton: {
    backgroundColor: '#FF8C00',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 40,
    minWidth: 100,
    shadowColor: '#FF8C00',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
