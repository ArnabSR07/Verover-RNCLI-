/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import PopularCleaners from './screens/PopularCleaners';
import ParkingSlot from './screens/ParkingSlot';
import FindParking from './screens/FindParking';
import DryCleanerDetail from './screens/DryCleanerDetail';
import DryCleaningServices from './screens/DryCleaningServices';
import LocationPage from './screens/LocationPage';
import DateAndTime from './screens/DateAndTime';
import { CartProvider } from './context/context';
import OrderDetails from './screens/OrderDetails';
import Payment from './screens/Payment';


const Stack = createStackNavigator();

function App() {
  return (
    <CartProvider>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}} />
        <Stack.Screen name="Cleaners" component={PopularCleaners} options={{headerShown:false}} />
        <Stack.Screen name="FindParking" component={FindParking} options={{headerShown:false}} />
        <Stack.Screen name="ParkingSlot" component={ParkingSlot} options={{headerShown:false}}/>
        <Stack.Screen name ="DryCleanerDetail" component={DryCleanerDetail} options={{headerShown:false}}/>
        <Stack.Screen name ="Services" component={DryCleaningServices} options={{headerShown:false}}/>
        <Stack.Screen name ="Location" component={LocationPage} options={{headerShown:false}}/>
        <Stack.Screen name ="Schedule" component={DateAndTime} options={{headerShown:false}}/>
        <Stack.Screen name ="Summary" component={OrderDetails} options={{headerShown:false}}/>
        <Stack.Screen name ="Payment" component={Payment} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </CartProvider>
  );
}

export default App;


// import React from 'react';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Provider } from 'react-redux';
// import StripeWrapper from './src/components/stripeWrapper';
// import Routes from './navigator/Routes';
// import { store } from './src/components/redux/store';

// function App(): React.JSX.Element {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Provider store={store}>
//          <StripeWrapper>
//           <Routes />
//         </StripeWrapper>
//       </Provider>
//     </GestureHandlerRootView>
//   );
// }

// export default App;
