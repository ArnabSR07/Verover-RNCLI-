import React, { useEffect, useState, useCallback, useRef } from 'react';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
import axiosInstance from  '../api/axios';
import { Alert, Platform } from 'react-native';

export default function StripeWrapper({ children }: { children: React.ReactElement | React.ReactElement[] }) {
    const [publicKey, setPublicKey] = useState<string>('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicKey = async () => {
            try {
                const res = await axiosInstance.get('/getStripePublicKey');
                if (res.data?.data?.key) {
                    setPublicKey(res.data.data.key);
                } else {
                    throw new Error('No Public Key Found');
                }
            } catch (error) {
                console.error('❌ Error fetching public key:', error);
                Alert.alert('Server Error', 'Failed to load payment configuration');
            } finally {
                setLoading(false);
            }
        };

        fetchPublicKey();
    }, []);

    if (loading || !publicKey) {
        return null;
    }

    return (
        <StripeProvider
            publishableKey={publicKey}
            merchantIdentifier="com.vervoer"
        >
            {children}
        </StripeProvider>
    );
}

export const useStripeWrapper = () => {
    const { initPaymentSheet, presentPaymentSheet, confirmPayment } = useStripe();
    const [loading, setLoading] = useState(false);
    const [isReadyForPayment, setIsReadyForPayment] = useState(false);

    // CRITICAL FIX: Use refs to persist state across re-renders
    const paymentDataRef = useRef<{
        clientSecret: string;
        customerId: string;
        ephemeralKey: string;
        paymentIntentId: string;
        isInitialized: boolean;
    }>({
        clientSecret: '',
        customerId: '',
        ephemeralKey: '',
        paymentIntentId: '',
        isInitialized: false,
    });

    // Keep state variables for compatibility but use refs as source of truth
    const [clientSecret, setClientSecret] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [ephemeralKey, setEphemeralKey] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');

    const initializedPaymentSheet = useCallback(async (
        paymentIntent: string,
        ephemeralKeySecret: string,
        customer: string,
        intentId?: string
    ): Promise<boolean> => {
        try {
            console.log('🔄 INITIALIZING PAYMENT SHEET');
            console.log('Platform:', Platform.OS);
            console.log('customer:', customer);
            console.log('paymentIntent:', paymentIntent ? 'present' : 'missing');
            console.log('ephemeralKey:', ephemeralKeySecret ? 'present' : 'missing');
            console.log('intentId:', intentId);

            // Validate inputs
            if (!paymentIntent) {
                throw new Error('Payment intent client secret is required');
            }
            if (!ephemeralKeySecret) {
                throw new Error('Ephemeral key is required');
            }
            if (!customer) {
                throw new Error('Customer ID is required');
            }

            setLoading(true);
            setIsReadyForPayment(false);

            // CRITICAL: Store in ref FIRST (this persists across re-renders)
            paymentDataRef.current = {
                clientSecret: paymentIntent,
                customerId: customer,
                ephemeralKey: ephemeralKeySecret,
                paymentIntentId: intentId || '',
                isInitialized: false, // Will set to true after successful init
            };

            // Also set state variables for compatibility
            setClientSecret(paymentIntent);
            setCustomerId(customer);
            setEphemeralKey(ephemeralKeySecret);
            if (intentId) setPaymentIntentId(intentId);

            console.log('🔍 Data stored in ref:', {
                hasClientSecret: !!paymentDataRef.current.clientSecret,
                hasCustomerId: !!paymentDataRef.current.customerId,
                hasEphemeralKey: !!paymentDataRef.current.ephemeralKey,
                hasPaymentIntentId: !!paymentDataRef.current.paymentIntentId,
            });

            const { error } = await initPaymentSheet({
                merchantDisplayName: 'Vervoer Pvt. Ltd.',
                customerId: customer,
                paymentIntentClientSecret: paymentIntent,
                customerEphemeralKeySecret: ephemeralKeySecret,
                allowsDelayedPaymentMethods: false,
                returnURL: Platform.select({
                    ios: 'your-app://stripe-redirect',
                    android: 'your-app://stripe-redirect',
                }),
                appearance: {
                    colors: {
                        primary: '#FF8C00',
                        background: '#ffffff',
                        componentBackground: '#f8f9fa',
                        componentBorder: '#e3e3e3',
                        componentDivider: '#e3e3e3',
                        primaryText: '#1a1a1a',
                        secondaryText: '#8a8a8a',
                        componentText: '#1a1a1a',
                        placeholderText: '#a0a0a0'
                    }
                },
                primaryButtonLabel: "Pay Now",
            });

            if (error) {
                console.error('❌ Payment sheet initialization error:', {
                    code: error.code,
                    message: error.message,
                    type: error.type,
                    localizedMessage: error.localizedMessage,
                });
                
                // Reset ref and state on error
                paymentDataRef.current = {
                    clientSecret: '',
                    customerId: '',
                    ephemeralKey: '',
                    paymentIntentId: '',
                    isInitialized: false,
                };
                setClientSecret('');
                setCustomerId('');
                setEphemeralKey('');
                setPaymentIntentId('');
                
                Alert.alert('Payment Setup Error', error?.localizedMessage || error?.message || 'Failed to initialize payment');
                return false;
            }

            // Mark as successfully initialized in ref
            paymentDataRef.current.isInitialized = true;
            setIsReadyForPayment(true);

            console.log('✅ Payment sheet initialized successfully');
            console.log('🔍 Payment ready state set to:', true);
            console.log('🔍 Ref state after init:', {
                isInitialized: paymentDataRef.current.isInitialized,
                hasData: !!(paymentDataRef.current.clientSecret && paymentDataRef.current.customerId),
            });
            
            return true;

        } catch (error: any) {
            console.error('❌ Payment initialization failed:', error);
            
            // Reset everything
            paymentDataRef.current = {
                clientSecret: '',
                customerId: '',
                ephemeralKey: '',
                paymentIntentId: '',
                isInitialized: false,
            };
            setClientSecret('');
            setCustomerId('');
            setEphemeralKey('');
            setPaymentIntentId('');
            setIsReadyForPayment(false);
            
            Alert.alert('Payment Setup Error', error?.message || 'Failed to initialize payment');
            return false;
        } finally {
            setLoading(false);
        }
    }, [initPaymentSheet]);

    const openPayment = useCallback(async (): Promise<boolean> => {
        try {
            console.log('🔄 OPENING PAYMENT SHEET');

            // CRITICAL: Use ref data as primary source of truth
            const refData = paymentDataRef.current;
            
            const currentState = {
                hasClientSecret: !!clientSecret,
                hasCustomerId: !!customerId,
                hasEphemeralKey: !!ephemeralKey,
                isReadyForPayment,
                loading,
            };

            const refState = {
                hasRefClientSecret: !!refData.clientSecret,
                hasRefCustomerId: !!refData.customerId,
                hasRefEphemeralKey: !!refData.ephemeralKey,
                refIsInitialized: refData.isInitialized,
            };

            console.log('🔍 Current state check:', currentState);
            console.log('🔍 Ref state check:', refState);

            // Use ref data for readiness check (this is the key fix)
            const hasRefData = refData.clientSecret && refData.customerId && refData.ephemeralKey && refData.isInitialized;
            const hasStateData = clientSecret && customerId && ephemeralKey && isReadyForPayment;

            console.log('🔍 Readiness determination:', {
                hasRefData: !!hasRefData,
                hasStateData: !!hasStateData,
                proceedingWith: hasRefData ? 'ref data' : (hasStateData ? 'state data' : 'neither'),
            });

            if (!hasRefData && !hasStateData) {
                console.error('❌ Payment sheet not ready');
                console.log('🔍 Readiness check failed:', {
                    refClientSecret: !!refData.clientSecret,
                    refCustomerId: !!refData.customerId,
                    refEphemeralKey: !!refData.ephemeralKey,
                    refIsInitialized: refData.isInitialized,
                    stateClientSecret: !!clientSecret,
                    stateCustomerId: !!customerId,
                    stateEphemeralKey: !!ephemeralKey,
                    stateIsReady: isReadyForPayment,
                });
                Alert.alert('Payment Error', 'Payment sheet not ready. Please try again.');
                return false;
            }

            if (loading) {
                console.warn('⚠️ Still loading, waiting...');
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            console.log('🔄 About to call presentPaymentSheet...');
            const { error } = await presentPaymentSheet();

            console.log('🔍 presentPaymentSheet result:', {
                hasError: !!error,
                errorCode: error?.code,
                errorMessage: error?.message,
            });

            if (error) {
                console.error('❌ Payment presentation error:', {
                    code: error.code,
                    message: error.message,
                    type: error.type,
                    localizedMessage: error.localizedMessage,
                });

                switch (error.code) {
                    case 'Canceled':
                        console.log('💡 User cancelled payment sheet');
                        return false;
                    
                    case 'Failed':
                        console.error('💥 Payment sheet failed to present');
                        Alert.alert('Payment Error', error.localizedMessage || 'Payment failed to display');
                        return false;
                    
                    case 'Timeout':
                        console.error('⏰ Payment sheet timed out');
                        Alert.alert('Payment Timeout', 'Payment timed out - please try again');
                        return false;
                    
                    default:
                        console.error('🔥 Unknown payment error');
                        Alert.alert('Payment Error', error.localizedMessage || error.message || 'Payment error occurred');
                        return false;
                }
            }

            console.log('✅ Payment completed successfully');
            return true;

        } catch (error: any) {
            console.error('❌ Payment presentation failed:', {
                message: error.message,
                stack: error.stack,
                name: error.name,
            });
            Alert.alert('Payment Error', error?.message || 'Failed to present payment sheet');
            return false;
        }
    }, [presentPaymentSheet, isReadyForPayment, loading, clientSecret, customerId, ephemeralKey]);

    const confirmMyPayment = useCallback(async (): Promise<boolean> => {
        try {
            // Use ref data as primary source
            const secretToUse = paymentDataRef.current.clientSecret || clientSecret;
            
            if (!secretToUse) {
                Alert.alert('Payment Error', 'No payment to confirm');
                return false;
            }

            console.log('🔄 Confirming payment');
            setLoading(true);

            const { error } = await confirmPayment(secretToUse);

            if (error) {
                console.error('❌ Payment confirmation error:', error);
                Alert.alert('Payment Confirmation Error', error?.message || 'Failed to confirm payment');
                return false;
            }

            console.log('✅ Payment confirmed successfully');
            return true;

        } catch (error: any) {
            console.error('❌ Payment confirmation failed:', error);
            Alert.alert('Payment Error', error?.message || 'Payment confirmation failed');
            return false;
        } finally {
            setLoading(false);
        }
    }, [confirmPayment, clientSecret]);

    // Helper function to reset payment state
    const resetPaymentState = useCallback(() => {
        paymentDataRef.current = {
            clientSecret: '',
            customerId: '',
            ephemeralKey: '',
            paymentIntentId: '',
            isInitialized: false,
        };
        setClientSecret('');
        setCustomerId('');
        setEphemeralKey('');
        setPaymentIntentId('');
        setIsReadyForPayment(false);
        setLoading(false);
        console.log('🔄 Payment state reset (both ref and state)');
    }, []);

    // Debug function to log current state
    const debugPaymentState = useCallback(() => {
        console.log('🔍 Current Payment State:', {
            // State variables
            stateClientSecret: !!clientSecret,
            stateCustomerId: !!customerId,
            stateEphemeralKey: !!ephemeralKey,
            statePaymentIntentId: !!paymentIntentId,
            stateIsReadyForPayment: isReadyForPayment,
            stateLoading: loading,
            // Ref variables (source of truth)
            refClientSecret: !!paymentDataRef.current.clientSecret,
            refCustomerId: !!paymentDataRef.current.customerId,
            refEphemeralKey: !!paymentDataRef.current.ephemeralKey,
            refPaymentIntentId: !!paymentDataRef.current.paymentIntentId,
            refIsInitialized: paymentDataRef.current.isInitialized,
        });
    }, [clientSecret, customerId, ephemeralKey, paymentIntentId, isReadyForPayment, loading]);

    return {
        initializedPaymentSheet,
        openPayment,
        confirmMyPayment,
        resetPaymentState,
        debugPaymentState,
        
        // State variables (for compatibility)
        loading,
        clientSecret,
        customerId,
        ephemeralKey,
        paymentIntentId,
        isReadyForPayment,
    };
};