import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../src/components/redux/hooks';
import { SafeAreaView, View, Text } from 'react-native';

import { MapSelector } from '../src/components/mapSelction';
// Import all your screens
import Splashscreen from '../src/pages/splashscreen';
import Onboarding from '../src/pages/onboarding';
import Login from '../src/pages/login';
import Signup from '../src/pages/signup';
import OTP from '../src/pages/OTP';
import OTPSuccess from '../src/pages/OTPSuccess';
import PersonalInfo from '../src/pages/PersonalInfo';
import EmailOTP from '../src/pages/EmailOTP';
import EmailOTPSuccess from '../src/pages/EmailOTPSuccess';
import ForgotPassword from '../src/pages/ForgotPassword';
import ForgotSuccess from '../src/pages/VerifyForgotOtp';
import HomePage from '../src/pages/Home/HomePage';
import UserHome from '../src/pages/Home/UserHome';
import MerchantHome from '../src/pages/Home/MerchantHome';
import Header from '../src/components/Header';
import Parking from '../src/pages/Parking/Parking';
import MyProfile from '../src/components/Drawer/MyProfile';
import FindParking from '../src/pages/Parking/FindParking';
import QRCode from '../src/pages/Parking/QRCode';
import LiveSessionScreen from '../src/pages/Parking/LiveSessionScreen';
import HistoryScreen from '../src/pages/Parking/HistoryScreen';
import ParkingSlot from '../src/pages/Parking/ParkingSlot';
import ParkingSpot from '../src/pages/Parking/ParkingSpot';
import ParkingSpace from '../src/pages/Parking/ParkingSpace';
import GarageScreen from '../src/pages/Parking/GarageScreen';
import Confirmation from '../src/pages/Parking/Confirmation';
import Payment from '../src/pages/Payment';
import EnterPhoneNumberRideShare from '../src/components/EnterPhoneNumberRideShare';
import VerifyOtp from '../src/components/VerifyOtp';
import VehicleInformation from '../src/components/VehicleInformation';
import DriverRegistrationCancel from '../src/components/DriverRegistrationCancel';
import UploadPhoto from '../src/components/UploadPhoto';
import SuccessfullyPopup from '../src/components/SuccessfullyPopup';
import UploadPhotoConf from '../src/components/UploadPhotoConf';
import VerifyOtp2 from '../src/components/VerifyOtp2';
import Decal from '../src/components/Decal';
import DriverHelpPage from '../src/components/DriverHelpPage';
import FareCard from '../src/components/Drawer/FareCard';
import EditCard from '../src/components/Drawer/EditCard';
import ScanCard from '../src/components/Drawer/ScanCard';
import AddCard from '../src/components/Drawer/AddCard';
import FAQ from '../src/components/Drawer/FAQ';
import UnSafe from '../src/components/Drawer/UnSafe';
import MarkNew from '../src/components/Drawer/MarkNew';
import Vehicleinfo from '../src/pages/RideShare/Vehicleinfo';
import Rideshare from '../src/pages/RideShare/Rideshare';
import BookRideAdult from '../src/pages/RideShare/BookRideAdult';
import ParkHistory from '../src/pages/RideShare/ParkHistory';
import RideDetailes from '../src/pages/RideShare/RideDetailes';
import DriverApplication from '../src/pages/RideShare/DriverApplication';
import Verifyotp from '../src/pages/RideShare/Verifyotp';
import Settings from '../src/components/Drawer/Settings';
import Contact from '../src/components/Drawer/Contact';
import ResetPassword from '../src/components/Drawer/ResetPassword';
import PrivacyPolicy from '../src/components/Drawer/PrivacyPolicy';
import CookiePolicy from '../src/components/Drawer/CookiePolicy';
import MerchantParking from '../src/pages/Merchant/MerchantParking';
import Residance from '../src/pages/Merchant/Residance';
import MerchantGarage from '../src/pages/Merchant/MerchantGarage';
import DryClean from '../src/pages/DryClean/DryClean';
import MerOrderHistory from '../src/pages/DryClean/MerOrderHistory';
import DryCleanerMerchantDetails from '../src/pages/DryClean/DryCleanerMerchantDetails';
import DryCleanerAvailability from '../src/pages/DryClean/DryCleanerAvailability';
import DryCleanerMerchant from '../src/pages/DryClean/DryCleanerMerchant';
import Pants from '../src/pages/DryClean/Pants';
import DryCleanerMerchantEdit from '../src/pages/DryClean/DryCleanerMerchantEdit';
import DriverInformation from '../src/pages/RideShare/DriverInformation';
import AccountInformation from '../src/pages/RideShare/AccountInformation';
import DriverAttestation from '../src/pages/RideShare/DriverAttestation';
import BookChildRide2 from '../src/pages/RideShare/BookChildRide2';
import PaymentPage from '../src/pages/Drycleaning/payment';
import OrderHistory from '../src/pages/Drycleaning/OrderHistory';
import LocateCleaners from '../src/pages/Drycleaning/LocateCleaners';
import ActiveOrderDetailes from '../src/pages/Drycleaning/ActiveOrderDetailes';
import TrackLiveOrder from '../src/pages/Drycleaning/TrackLiveOrder';
import PurchaseReceipt from '../src/pages/Drycleaning/PurchaseReceipt';
import NumberofItems from '../src/pages/Drycleaning/NumberofItems';
import PickupLocation from '../src/pages/Drycleaning/PickupLocation';
import DropLocation from '../src/pages/Drycleaning/DropLocation';
import PickTime from '../src/pages/Drycleaning/PickTime';
import DryorderSummary from '../src/pages/Drycleaning/DryorderSummary';
import DryCleanersList from '../src/pages/Drycleaning/DrycleanerList';
import PublicTransit from '../src/pages/PublicTransit/PublicTransit';
import BuyBusTicket from '../src/pages/PublicTransit/BuyBusTicket';
import OrderHistoryNew from '../src/pages/Drycleaning/OrderHistoryNew';
import DryCleanAbout from '../src/pages/DryClean/DryCleanAbout';
import AvailableParking from '../src/pages/Merchant/AvailableParking';
import BookParking from '../src/components/Merchant/BookParking';
import ImagePickerScreen from '../src/pages/Merchant/ImagePickerScreen';
import ParkingMerchantDetails from '../src/pages/Merchant/ParkingMerchantDetails';
import DriverMainHome from '../src/pages/Home/DriverMainHome';
import BookTrainTicket from '../src/pages/PublicTransit/BookTrainTicket';
import BusTicketsPurchased from '../src/pages/PublicTransit/BusTicketsPurchased';
import BuyBusTicket4 from '../src/pages/PublicTransit/BuyBusTicket4';
import BuyTrainTicket from '../src/pages/PublicTransit/BuyTrainTicket';
import CancelBusTicket from '../src/pages/PublicTransit/CancelBusTicket';
import CancelBusTicketSuccessfully from '../src/pages/PublicTransit/CancelBusTicketSuccessfully';
import CancelTrainTicket from '../src/pages/PublicTransit/CancelTrainTIcket';
import CancelTrainTicketSuccessfully from '../src/pages/PublicTransit/CancelTrainTicketSuccessfully';
import PassengerInformation from '../src/pages/PublicTransit/PassengerInformation';
import PassengerInformationForTrain from '../src/pages/PublicTransit/PassengerInformationForTrain';
import TicketBookingHistory from '../src/pages/PublicTransit/TicketBookingHistory';
import TicketsSummary from '../src/pages/PublicTransit/TicketsSummary';
import TicketSummaryTrain from '../src/pages/PublicTransit/TicketsSummaryTrain';
import TrainTicketPurchased from '../src/pages/PublicTransit/TrainTicketPurchased';
import UpcomingJourneyByBus from '../src/pages/PublicTransit/UpcomingJourneyByBus';
import FoodDeliveryHome from '../src/pages/Home/FoodDeliveryHome';
import MicroMobility from '../src/pages/MicroMobility/MicroMobility';
import MobilityHistory from '../src/pages/MicroMobility/MobilityHistory';
import BookMobility from '../src/pages/MicroMobility/BookMobility';
import BookMicroMobility from '../src/pages/MicroMobility/BookMicroMobility';
import BikeDetailes from '../src/pages/MicroMobility/BikeDetailes';
import BookMicroMobility2 from '../src/pages/MicroMobility/BookMicroMobility2';
import BookingConfirmation from '../src/pages/MicroMobility/BookingConfirmation';
import BookingSuccess from '../src/pages/MicroMobility/BookingSuccess';
import LiveSession1 from '../src/pages/MicroMobility/LiveSession1';
import CancelBooking from '../src/pages/MicroMobility/CancelBooking';
import BookingCancelled from '../src/pages/MicroMobility/BookingCancelled';
import SessionSummary from '../src/pages/MicroMobility/SessionSummary';
import SessionFinished from '../src/pages/MicroMobility/SessionFinished';
import PopupThanks from '../src/pages/MicroMobility/PopupThanks';
import LocateDryCleaning1 from '../src/pages/DryCleanersDrivers/LocateDryCleaning1';
import DryCleaningPickup from '../src/pages/DryCleanersDrivers/DryCleaningPickup';
import DryCleaningDropoff from '../src/pages/DryCleanersDrivers/DryCleaningDropoff';
import OrderDropOff from '../src/pages/DryCleanersDrivers/OrderDropOff';
import SuccessfulPopup from '../src/pages/DryCleanersDrivers/SuccessfulPopup';
import ReceiptOfCompletion from '../src/pages/DryCleanersDrivers/ReceiptOfCompletion';
import WaitingForPickup from '../src/pages/DryCleanersDrivers/WaitingForPickup';
import CancelPickup from '../src/pages/DryCleanersDrivers/CancelPickup';
import OrderDetailes from '../src/pages/DryCleanersDrivers/OrderDetailes';
import PickupSuccessfulPopup from '../src/pages/DryCleanersDrivers/PickupSuccessfulPopup';
import CancelDropOff from '../src/pages/DryCleanersDrivers/CancelDropOff';
import WaitingForDropoff from '../src/pages/DryCleanersDrivers/WaitingForDropoff';
import RideCancelled from '../src/pages/RideShare/RideCancelled';
import RideshareCancelBooking from '../src/pages/RideShare/RideshareCancelBooking';
import CancelBooking2 from '../src/pages/RideShare/CancelBooking2';
import RideShareVideo from '../src/pages/RideShare/RideShareVideo';
import RideSharePopupVideo from '../src/pages/RideShare/RideSharePopupVideo';
import RideshareSummary from '../src/pages/RideShare/RideshareSummary';
import RideshareSessionFinished from '../src/pages/RideShare/RideshareSessionFinished';
import RideshareSubmitPopup from '../src/pages/RideShare/RideshareSubmitPopup';
import CarShare from '../src/pages/CarShare/CarShare';
import CarDetailes from '../src/pages/CarShare/CarDetailes';
import BookNewCar from '../src/pages/CarShare/BookNewCar';
import CarChoice from '../src/pages/CarShare/CarChoice';
import CarHistory from '../src/pages/CarShare/CarHistory';
import CarbookingConfirmation from '../src/pages/CarShare/CarbookingConfirmation';
import CarbookingSuccess from '../src/pages/CarShare/CarbookingSuccess';
import MyCars from '../src/pages/CarShare/MyCars';
import CarLivesession from '../src/pages/CarShare/CarLivesession';
import CarSummary from '../src/pages/CarShare/CarSummary';
import CarsessionFinished from '../src/pages/CarShare/CarsessionFinished';
import Putnewcar from '../src/pages/CarShare/Putnewcar';
import PreviewMyCar from '../src/pages/CarShare/PreviewMyCar';
import Submitpopup from '../src/pages/CarShare/Submitpopup';
import CarshareDeletePopup from '../src/pages/CarShare/CarshareDeletePopup';
import PreviewCar from '../src/pages/CarShare/PreviewCar';
import CarbookingCancel from '../src/pages/CarShare/CarbookingCancel';
import CarBookingCancelled from '../src/pages/CarShare/CarBookingCancelled';
import CartModal from '../src/components/FoodDeliveryComponent/CartModal';
import PizzaListScreen from '../src/pages/FoodDelivery/PizzaListScreen';
import PizzaFood from '../src/pages/FoodDelivery/PizzaFood';
import OngoingOrdersScreen from '../src/pages/FoodDelivery/OngoingOrdersScreen';
import FoodRestaurant from '../src/pages/FoodDelivery/FoodRestaurant';
import ViewMenu from '../src/pages/FoodDelivery/ViewMenu';
import PizzaDetails from '../src/pages/FoodDelivery/PizzaDetails';
import Checkout from '../src/pages/FoodDelivery/Checkout';
import OrderFoodScreen from '../src/pages/FoodDelivery/OrderFoodScreen';
import OrderFoodHistory from '../src/pages/FoodDelivery/OrderFoodHistory';
import OrderReceived from '../src/pages/FoodDelivery/OrderReceived';
import TrackFoodOrder from '../src/pages/FoodDelivery/TrackFoodOrder';
import OrderDetailsScreen from '../src/pages/Drycleaning/MyOrder'
import RideTracking from '../src/pages/LocateRider/RideTrackingLocate';
import RideTrackingLocate from '../src/pages/LocateRider/RideTrackingLocate';
import RideAcceptScreen from '../src/pages/LocateRider/RideAcceptScreen';
import MerchantGarageForm from '../src/pages/Merchant/MerchantGarageForm';
import MerchantParkingForm from '../src/pages/Merchant/MerchantParkingForm';
import MapNavigation from '../src/pages/MapNavigation';
import { ParkingLot, GarageMerchantDetails, Residence } from '../src/types';
import MerchantGarageList from '../src/pages/Merchant/MerchantGarageList';
import ForgetResetPassword from '../src/pages/ForgetResetPassword';
import { getAuthFromAsyncStorage, resetFromState } from '../src/components/redux/authSlice';
import MerchantBookingHistoryScreen from '../src/pages/Merchant/MerchantBookingHistory';
import MerchantParkinglotList from '../src/pages/Merchant/MerchantParkinglotList';
import MyDryCleaners from '../src/pages/DryClean/DrycleanerShop';
import MerchantResidenceForm from '../src/pages/Merchant/MerchantResidenceForm';
import MerchantResidenceList from '../src/pages/Merchant/MerchantResidenceList';
import MerchantResidence from '../src/pages/Merchant/MerchantResidence';
import { responsiveWidth } from 'react-native-responsive-dimensions';
import OrderReceiptPage from '../src/pages/Drycleaning/OrderReceiptPage';
import PickupAndDeliveryAddressScreen from '../src/pages/Drycleaning/PickupAndDeliveryAddressScreen';

import { Modal } from 'react-native-paper';
import Scan from '../src/pages/Merchant/Scan';
interface Location { latitude: number; longitude: number }
type ParkingSpaceParams = ({ lot: ParkingLot, type: 'L' } | { lot: GarageMerchantDetails, type: 'G' } | {lot : Residence, type: 'R'}) & { endTime?: string };
type ConfirmationParams = ParkingSpaceParams & { selectedSpot?: string };

export type RootStackParamList = {
    Splash: undefined;
    Onboarding: undefined;
    Login: undefined;
    Signup: undefined;
    OTP: { phoneNumber?: string; tempUserId?: string; confirmation?: any };
    OTPSuccess: undefined;
    PersonalInfo: undefined;
    EmailOTP: undefined;
    EmailOTPSuccess: undefined;
    ForgotPassword: undefined;
    ForgotSuccess: { email: string; userType: string };
    VerifyForgotOtp: { email: string; userType: string };
    ResetPassword: { email: string; userType: string };
    MapNavigation: { destination: Location }
    HomePage: undefined;
    UserHome: undefined;
    MerchantHome: undefined;
    Parking: undefined;
    FindParking: undefined;
    QRCode: { bookingId: string };

    LiveSession: { bookingId: string, type: 'G' | 'L' | 'R' };
    History: undefined;
    ParkingSlot: { location?: Location };
    ParkingSpot: { location?: Location, endTime?: string , startTime? : string };
    ParkingSpace: ParkingSpaceParams;
    GarageScreen?: ParkingSpaceParams;
    Confirmation: ConfirmationParams;
    Payment: undefined;
    EnterPhoneNumberRideShare: undefined;
    VerifyOtp: undefined;
    VehicleInformation: undefined;
    DriverInformation: undefined;
    AccountInformation: undefined;
    DriverRegistrationCancel: undefined;
    DriverAttestation: undefined;
    BookChildRide2: undefined;
    UploadPhoto: undefined;
    SuccessfullyPopup: undefined;
    UploadPhotoConf: undefined;
    VerifyOtp2: undefined;
    Decal: undefined;
    DriverHelpPage: undefined;
    MyProfile: undefined;
    FareCard: undefined;
    EditCard: undefined;
    ScanCard: undefined;
    AddCard: undefined;
    FAQ: undefined;
    UnSafe: undefined;
    MarkNew: undefined;
    Verifyotp: undefined;
    Vehicleinfo: undefined;
    Rideshare: undefined;
    BookRideAdult: undefined;
    ParkHistory: undefined;
    RideDetailes: undefined;
    DriverApplication: undefined;
    Settings: undefined;
    Contact: undefined;
    // ResetPassword: undefined;
    ForgetResetPassword: undefined;
    PrivacyPolicy: undefined;
    CookiePolicy: undefined;
    MerchantParking: undefined;
    Residance: undefined;
    MerchantGarage: undefined;
    DryClean: undefined;
    MerOrderHistory: undefined;
    DryCleanerMerchantDetails: undefined;
    DryCleanerAvailability: undefined;
    DryCleanerMerchant: undefined;
    Pants: undefined;
    DryCleanerMerchantEdit: undefined;
    LocateCleaners: undefined;
    DrycleanerList: undefined;
    NumberofItems: undefined;
    PickupLocation: undefined;
    DropLocation: undefined;
    PickTime: undefined;
    DryorderSummary: undefined;
    PurchaseReceipt: undefined;
    ActiveOrderDetailes: undefined;
    TrackLiveOrder: undefined;
    OrderHistory: undefined;
    PublicTransit: undefined;
    BuyBusTicket: undefined;
    OrderHistoryNew: undefined;
    DryCleanAbout: undefined;
    AvailableParking: undefined;
    BookParking: undefined;
    ImagePickerScreen: undefined;
    ParkingMerchantDetails: undefined;
    DriverMainHome: undefined;
    BookTrainTicket: undefined;
    BusTicketsPurchased: undefined;
    BuyBusTicket4: undefined;
    PassengerInformationForTrain: undefined;
    CancelBusTicket: undefined;
    CancelBusTicketSuccessfully: undefined;
    CancelTrainTicket: undefined;
    PassengerInformation: undefined;
    UpcomingJourneyByBus: undefined;
    TrainTicketPurchased: undefined;
    TicketSummaryTrain: undefined;
    CancelTrainTicketSuccessfully: undefined;
    TicketsSummary: undefined;
    TicketBookingHistory: undefined;
    BuyTrainTicket: undefined;
    FoodDeliveryHome: undefined;
    MicroMobility: undefined;
    MobilityHistory: undefined;
    BookMobility: undefined;
    BookMicroMobility: undefined;
    BikeDetailes: undefined;
    BookMicroMobility2: undefined;
    BookingConfirmation: undefined;
    BookingSuccess: undefined;
    LiveSession1: undefined;
    CancelBooking: undefined;
    BookingCancelled: undefined;
    SessionSummary: undefined;
    SessionFinished: undefined;
    PopupThanks: undefined;
    LocateDryCleaning1: undefined;
    DryCleaningPickup: undefined;
    DryCleaningDropoff: undefined;
    OrderDropOff: undefined;
    SuccessfulPopup: undefined;
    ReceiptOfCompletion: undefined;
    WaitingForPickup: undefined;
    CancelPickup: undefined;
    OrderDetailes: undefined;
    PickupSuccessfulPopup: undefined;
    CancelDropOff: undefined;
    WaitingForDropoff: undefined;
    RideCancelled: undefined;
    RideshareCancelBooking: undefined;
    CancelBooking2: undefined;
    RideShareVideo: undefined;
    RideSharePopupVideo: undefined;
    RideshareSummary: undefined;
    RideshareSessionFinished: undefined;
    RideshareSubmitPopup: undefined;
    CarShare: undefined;
    CarDetailes: undefined;
    BookNewCar: undefined;
    CarChoice: undefined;
    CarHistory: undefined;
    CarbookingConfirmation: undefined;
    CarbookingSuccess: undefined;
    MyCars: undefined;
    CarLivesession: undefined;
    CarSummary: undefined;
    CarsessionFinished: undefined;
    Putnewcar: undefined;
    PreviewMyCar: undefined;
    Submitpopup: undefined;
    CarshareDeletePopup: undefined;
    PreviewCar: undefined;
    CarbookingCancel: undefined;
    CarBookingCancelled: undefined;
    CartModal: undefined;
    PizzaListScreen: undefined;
    PizzaFood: undefined;
    OngoingOrdersScreen: undefined;
    FoodRestaurant: undefined;
    ViewMenu: undefined;
    PizzaDetails: undefined;
    Checkout: undefined;
    OrderFoodScreen: undefined;
    OrderFoodHistory: undefined;
    OrderReceived: undefined;
    TrackFoodOrder: undefined;
    RideTrackingLocate: undefined;
    RideAcceptScreen: undefined;
    MerchantGarageForm: undefined;
    MerchantParkingForm: undefined;
    MerchantGarageList: undefined;
    MerchantParkinglotList: undefined;
    MyDryCleaners: undefined;
    MerchantResidenceForm: undefined;
    MerchantResidenceList: undefined;
    MerchantResidence: undefined;
    MerchantBookingHistoryScreen: undefined;
    Scan: undefined;
    PaymentPage: undefined;
    MyOrder:undefined;
    PickupAndDeliveryAddressScreen:undefined;
    OrderReceiptPage: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();
const CartModalScreen = ({ navigation }: { navigation: any }) => {
    return <CartModal visible={true} onClose={() => navigation.goBack()} />;
};
const PostVerificationStack = () => (
    <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={Splashscreen} />
        <Stack.Screen name="Onboarding" component={Onboarding} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="OTP" component={OTP} />
        <Stack.Screen name="OTPSuccess" component={OTPSuccess} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfo} />
        <Stack.Screen name="EmailOTP" component={EmailOTP} />
        <Stack.Screen name="EmailOTPSuccess" component={EmailOTPSuccess} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="ForgetResetPassword" component={ForgetResetPassword} />
        <Stack.Screen name="ForgotSuccess" component={ForgotSuccess} />
    </Stack.Navigator>
);

const PostAuthStack = () => {
    const user = useAppSelector(state => state.auth.user);
    return (

        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ zIndex: 10, position: 'absolute', width: responsiveWidth(100) }}>
                <Header />
            </View>
            <View style={{ flex: 1, zIndex: 1 }}>
                <Stack.Navigator screenOptions={{ headerShown: false }}
                    initialRouteName={user?.userType === 'user' ? 'UserHome' :
                        user?.userType === 'merchant' ? 'MerchantHome' : 'DriverMainHome'}>
                    <Stack.Screen name="HomePage" component={HomePage} />
                    <Stack.Screen name="UserHome" component={UserHome} />
                    <Stack.Screen name="MerchantHome" component={MerchantHome} />
                    <Stack.Screen name="Parking" component={Parking} />
                    <Stack.Screen name="FindParking" component={FindParking} />
                    <Stack.Screen name="ParkingSlot" component={ParkingSlot} />
                    <Stack.Screen name="ParkingSpot" component={ParkingSpot} />
                    <Stack.Screen name="ParkingSpace" component={ParkingSpace} />
                    <Stack.Screen name="MapNavigation" component={MapNavigation}
                        initialParams={{ destination: { longitude: 88.59, latitude: 24.56 } }} />
                    <Stack.Screen name="GarageScreen" component={GarageScreen} />
                    <Stack.Screen name="QRCode" component={QRCode} />
                    <Stack.Screen name="LiveSession" component={LiveSessionScreen} />
                    <Stack.Screen name="Confirmation" component={Confirmation} />
                    <Stack.Screen name="History" component={HistoryScreen} />
                    <Stack.Screen name="Payment" component={Payment} />
                    <Stack.Screen name="EnterPhoneNumberRideShare" component={EnterPhoneNumberRideShare} />
                    <Stack.Screen name="VerifyOtp" component={VerifyOtp} />
                    <Stack.Screen name="VehicleInformation" component={VehicleInformation} />
                    <Stack.Screen name="DriverInformation" component={DriverInformation} />
                    <Stack.Screen name="AccountInformation" component={AccountInformation} />
                    <Stack.Screen name="DriverAttestation" component={DriverAttestation} />
                    <Stack.Screen name="UploadPhoto" component={UploadPhoto} />
                    <Stack.Screen name="UploadPhotoConf" component={UploadPhotoConf} />
                    <Stack.Screen name="VerifyOtp2" component={VerifyOtp2} />
                    <Stack.Screen name="Decal" component={Decal} />
                    <Stack.Screen name="MyProfile" component={MyProfile} />
                    <Stack.Screen name="FareCard" component={FareCard} />
                    <Stack.Screen name="EditCard" component={EditCard} />
                    <Stack.Screen name="AddCard" component={AddCard} />
                    <Stack.Screen name="FAQ" component={FAQ} />
                    <Stack.Screen name="UnSafe" component={UnSafe} />
                    <Stack.Screen name="MarkNew" component={MarkNew} />
                    <Stack.Screen name="Verifyotp" component={Verifyotp} />
                    <Stack.Screen name="Rideshare" component={Rideshare} />
                    <Stack.Screen name="BookRideAdult" component={BookRideAdult} />
                    <Stack.Screen name="ParkHistory" component={ParkHistory} />
                    <Stack.Screen name="RideDetailes" component={RideDetailes} />
                    <Stack.Screen name="DriverApplication" component={DriverApplication} />
                    <Stack.Screen name="Vehicleinfo" component={Vehicleinfo} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="Contact" component={Contact} />
                    <Stack.Screen name="ResetPassword" component={ResetPassword} />
                    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                    <Stack.Screen name="CookiePolicy" component={CookiePolicy} />
                    <Stack.Screen name="MerchantParking" component={MerchantParking} />
                    <Stack.Screen name="Residance" component={Residance} />
                    <Stack.Screen name="MerchantGarage" component={MerchantGarage} />
                    <Stack.Screen name="DryClean" component={DryClean} />
                    <Stack.Screen name="MerOrderHistory" component={MerOrderHistory} />
                    <Stack.Screen name="DryCleanerMerchantDetails" component={DryCleanerMerchantDetails} />
                    <Stack.Screen name="DryCleanerAvailability" component={DryCleanerAvailability} />
                    <Stack.Screen name="DryCleanerMerchant" component={DryCleanerMerchant} />
                    <Stack.Screen name="Pants" component={Pants} />
                    <Stack.Screen name="DryCleanerMerchantEdit" component={DryCleanerMerchantEdit} />
                    <Stack.Screen name="MyOrder" component={OrderDetailsScreen} />
                    <Stack.Screen name="PickupAndDeliveryAddressScreen" component={PickupAndDeliveryAddressScreen} />
                    

                    <Stack.Screen name="LocateCleaners" component={LocateCleaners} />
                    <Stack.Screen name="DrycleanerList" component={DryCleanersList} />
                    <Stack.Screen name="NumberofItems" component={NumberofItems} />
                    <Stack.Screen name="PickupLocation" component={PickupLocation} />
                    <Stack.Screen name="DropLocation" component={DropLocation} />
                    <Stack.Screen name="PickTime" component={PickTime} />
                    <Stack.Screen name="DryorderSummary" component={DryorderSummary} />
                    <Stack.Screen name="PurchaseReceipt" component={PurchaseReceipt} />
                    <Stack.Screen name="ActiveOrderDetailes" component={ActiveOrderDetailes} />
                    <Stack.Screen name="TrackLiveOrder" component={TrackLiveOrder} />
                    <Stack.Screen name="OrderHistory" component={OrderHistory} />
                    <Stack.Screen name="PublicTransit" component={PublicTransit} />
                    <Stack.Screen name="BuyBusTicket" component={BuyBusTicket} />
                    <Stack.Screen name="OrderHistoryNew" component={OrderHistoryNew} />
                    <Stack.Screen name="DryCleanAbout" component={DryCleanAbout} />
                    <Stack.Screen name="AvailableParking" component={AvailableParking} />
                    <Stack.Screen name="BookParking" component={BookParking} />
                    <Stack.Screen name="ImagePickerScreen" component={ImagePickerScreen} />
                    <Stack.Screen name="ParkingMerchantDetails" component={ParkingMerchantDetails} />
                    <Stack.Screen name="DriverMainHome" component={DriverMainHome} />
                    <Stack.Screen name="BookTrainTicket" component={BookTrainTicket} />
                    <Stack.Screen name="BusTicketsPurchased" component={BusTicketsPurchased} />
                    <Stack.Screen name="BuyBusTicket4" component={BuyBusTicket4} />
                    <Stack.Screen name="BuyTrainTicket" component={BuyTrainTicket} />

                    <Stack.Screen name="PassengerInformationForTrain" component={PassengerInformationForTrain} />
                    <Stack.Screen name="CancelBusTicket" component={CancelBusTicket} />
                    <Stack.Screen name="CancelBusTicketSuccessfully" component={CancelBusTicketSuccessfully} />
                    <Stack.Screen name="CancelTrainTicket" component={CancelTrainTicket} />
                    <Stack.Screen name="PassengerInformation" component={PassengerInformation} />
                    <Stack.Screen name="UpcomingJourneyByBus" component={UpcomingJourneyByBus} />
                    <Stack.Screen name="TrainTicketPurchased" component={TrainTicketPurchased} />
                    <Stack.Screen name="TicketSummaryTrain" component={TicketSummaryTrain} />
                    <Stack.Screen name="TicketBookingHistory" component={TicketBookingHistory} />
                    <Stack.Screen name="TicketsSummary" component={TicketsSummary} />
                    <Stack.Screen name="CancelTrainTicketSuccessfully" component={CancelTrainTicketSuccessfully} />
                    <Stack.Screen name="MicroMobility" component={MicroMobility} />
                    <Stack.Screen name="MobilityHistory" component={MobilityHistory} />
                    <Stack.Screen name="BookMobility" component={BookMobility} />
                    <Stack.Screen name="BookMicroMobility" component={BookMicroMobility} />
                    <Stack.Screen name="BikeDetailes" component={BikeDetailes} />
                    <Stack.Screen name="BookMicroMobility2" component={BookMicroMobility2} />
                    <Stack.Screen name="BookingConfirmation" component={BookingConfirmation} />
                    <Stack.Screen name="BookingSuccess" component={BookingSuccess} />
                    <Stack.Screen name="LiveSession1" component={LiveSession1} />
                    <Stack.Screen name="CancelBooking" component={CancelBooking} />
                    <Stack.Screen name="BookingCancelled" component={BookingCancelled} />
                    <Stack.Screen name="SessionSummary" component={SessionSummary} />
                    <Stack.Screen name="SessionFinished" component={SessionFinished} />
                    <Stack.Screen name="PopupThanks" component={PopupThanks} />
                    <Stack.Screen name="LocateDryCleaning1" component={LocateDryCleaning1} />
                    <Stack.Screen name="DryCleaningPickup" component={DryCleaningPickup} />
                    <Stack.Screen name="DryCleaningDropoff" component={DryCleaningDropoff} />
                    <Stack.Screen name="OrderDropOff" component={OrderDropOff} />
                    <Stack.Screen name="SuccessfulPopup" component={SuccessfulPopup} />
                    <Stack.Screen name="ReceiptOfCompletion" component={ReceiptOfCompletion} />
                    <Stack.Screen name="WaitingForPickup" component={WaitingForPickup} />
                    <Stack.Screen name="CancelPickup" component={CancelPickup} />
                    <Stack.Screen name="CartModal" component={CartModalScreen} options={{ presentation: 'modal' }} />
                    <Stack.Screen name="PizzaListScreen" component={PizzaListScreen} />

                    <Stack.Screen name="PaymentPage" component={PaymentPage} />
                    <Stack.Screen name="OrderReceiptPage" component={OrderReceiptPage} />


                    <Stack.Screen name="FoodDeliveryHome" component={FoodDeliveryHome} />
                    <Stack.Screen name="OrderFoodScreen" component={OrderFoodScreen} />
                    <Stack.Screen name="PizzaFood" component={PizzaFood} />
                    <Stack.Screen name="OngoingOrdersScreen" component={OngoingOrdersScreen} />
                    <Stack.Screen name="FoodRestaurant" component={FoodRestaurant} />
                    <Stack.Screen name="ViewMenu" component={ViewMenu} />
                    <Stack.Screen name="PizzaDetails" component={PizzaDetails} />
                    <Stack.Screen name="Checkout" component={Checkout} />

                    <Stack.Screen name="OrderDetailes" component={OrderDetailes} />
                    <Stack.Screen name="PickupSuccessfulPopup" component={PickupSuccessfulPopup} />
                    <Stack.Screen name="CancelDropOff" component={CancelDropOff} />
                    <Stack.Screen name="WaitingForDropoff" component={WaitingForDropoff} />
                    <Stack.Screen name="RideCancelled" component={RideCancelled} />
                    <Stack.Screen name="RideshareCancelBooking" component={RideshareCancelBooking} />
                    <Stack.Screen name="CancelBooking2" component={CancelBooking2} />
                    <Stack.Screen name="RideShareVideo" component={RideShareVideo} />
                    <Stack.Screen name="RideSharePopupVideo" component={RideSharePopupVideo} />
                    <Stack.Screen name="RideshareSummary" component={RideshareSummary} />
                    <Stack.Screen name="RideshareSessionFinished" component={RideshareSessionFinished} />
                    <Stack.Screen name="RideshareSubmitPopup" component={RideshareSubmitPopup} />
                    <Stack.Screen name="CarShare" component={CarShare} />
                    <Stack.Screen name="CarDetailes" component={CarDetailes} />
                    <Stack.Screen name="BookNewCar" component={BookNewCar} />
                    <Stack.Screen name="CarChoice" component={CarChoice} />
                    <Stack.Screen name="CarHistory" component={CarHistory} />
                    <Stack.Screen name="CarbookingConfirmation" component={CarbookingConfirmation} />
                    <Stack.Screen name="CarbookingSuccess" component={CarbookingSuccess} />
                    <Stack.Screen name="MyCars" component={MyCars} />
                    <Stack.Screen name="CarLivesession" component={CarLivesession} />
                    <Stack.Screen name="CarSummary" component={CarSummary} />
                    <Stack.Screen name="CarsessionFinished" component={CarsessionFinished} />
                    <Stack.Screen name="Putnewcar" component={Putnewcar} />
                    <Stack.Screen name="PreviewMyCar" component={PreviewMyCar} />
                    <Stack.Screen name="Submitpopup" component={Submitpopup} />
                    <Stack.Screen name="CarshareDeletePopup" component={CarshareDeletePopup} />
                    <Stack.Screen name="PreviewCar" component={PreviewCar} />
                    <Stack.Screen name="CarbookingCancel" component={CarbookingCancel} />
                    <Stack.Screen name="CarBookingCancelled" component={CarBookingCancelled} />
                    <Stack.Screen name="OrderFoodHistory" component={OrderFoodHistory} />
                    <Stack.Screen name="TrackFoodOrder" component={TrackFoodOrder} />
                    <Stack.Screen name="OrderReceived" component={OrderReceived} />
                    <Stack.Screen name="RideTrackingLocate" component={RideTrackingLocate} />
                    <Stack.Screen name="RideAcceptScreen" component={RideAcceptScreen} />
                    <Stack.Screen name="MerchantGarageForm" component={MerchantGarageForm} />
                    <Stack.Screen name="MerchantParkingForm" component={MerchantParkingForm} />
                    <Stack.Screen name="MerchantGarageList" component={MerchantGarageList} />
                    <Stack.Screen name="MerchantParkinglotList" component={MerchantParkinglotList} />
                    <Stack.Screen name='MyDryCleaners' component={MyDryCleaners} />
                    <Stack.Screen name='MerchantResidenceForm' component={MerchantResidenceForm} />
                    <Stack.Screen name='MerchantResidenceList' component={MerchantResidenceList} />
                    <Stack.Screen name='MerchantResidence' component={MerchantResidence} />
                    <Stack.Screen name='MerchantBookingHistoryScreen' component={MerchantBookingHistoryScreen} />
                    <Stack.Screen name='Scan' component={Scan} />
                    {/* <Stack.Screen name="ScanCard" component={ScanCard}/> */}
                    <Stack.Screen
                        name="SuccessfullyPopup"
                        component={SuccessfullyPopup}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen name="DriverHelpPage" component={DriverHelpPage} />
                </Stack.Navigator>
            </View>
        </SafeAreaView>
    );
};

const Routes = () => {
    // Fetch authentication status from Redux
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const authState = useAppSelector(state => state.auth);
    const token = useAppSelector(state => state.auth.token);
    const [loading, setLoading] = useState(false);
    const dispatch = useAppDispatch();
    console.log('Token : ', token);
    console.log('IsAuthenticated : ', isAuthenticated);
    useEffect(() => {
        console.log("AuthState:", authState);
    }, [authState])
    useEffect(() => {
        setLoading(true);
        getAuthFromAsyncStorage().then(e => {
            console.log(e);
            if (authState.isAuthenticated) {
                console.log("Already Authenticated; return");
            } else {
                console.log("RESETING AUTHSTATE");
                dispatch(resetFromState(e))
            }
        }).finally(() => setLoading(false));
    }, [])
    if (loading) {
        return (
            <View>
                <Text>Loading</Text>
            </View>
        )
    }
    return (
        <NavigationContainer>
            {isAuthenticated ? <PostAuthStack /> : <PostVerificationStack />}
        </NavigationContainer>
    );
};

export default Routes;
