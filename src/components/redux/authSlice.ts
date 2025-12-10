import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import { AppDispatch , RootState} from './store';
import axiosInstance from '../../api/axios';
import { useSelector } from 'react-redux'; // Note: useSelector typically used in components, not slices
import { AxiosError } from 'axios';
import { CloudLightning } from 'react-native-feather'; // This import seems unused, might be removable
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ Define Personal Information Interface
interface PersonalInfoData {
    _id?: string; // <--- FIX: Add this line. It's optional because it might not exist until registered/logged in.
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phoneNumber: string;
    country?: string;
    state?: string;
    zipCode?: string;
    userType: string;
    token?: string; // Token is typically separate from user data, but your current setup includes it here.
    stripeCustomerId?: string; // Add this if you also store it on the user object
}

// ✅ Define Authentication State
interface AuthState {
    isAuthenticated: boolean;
    user: PersonalInfoData | null;
    loading: boolean;
    error: string | null;
    token : string | null | undefined ;
}

// ✅ Initial Authentication State
const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    token : null,
};

// ✅ Create Authentication Slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        // Change PayloadAction type to include _id as well, as it's coming from backend
        registerStart(state, action: PayloadAction<PersonalInfoData>) {
            state.user = action.payload;
            state.loading = true;
            state.token = action.payload.token;
            state.isAuthenticated = false; // Should be true after successful registration/verification
            saveAuthAtCache(state);
        },
        verifySuccess(state) {
            state.isAuthenticated = true;
            state.error = null;
            state.loading = false;
            saveAuthAtCache(state);
        },
        // Change PayloadAction type to include _id as well, as it's coming from backend
        loginSuccess(state, action: PayloadAction<PersonalInfoData>) {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            state.token = action.payload.token;
            saveAuthAtCache(state);
        },
        loginFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            saveAuthAtCache(state);
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
            state.loading = false;
            state.error = null;
            state.token = null; // Ensure token is also cleared on logout
            saveAuthAtCache(state);
        },
        resetFromState(state, action: PayloadAction<AuthState>){
          state.isAuthenticated = action.payload.isAuthenticated;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.loading = action.payload.loading;
          state.error = action.payload.error;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure, logout , registerStart, verifySuccess , resetFromState} = authSlice.actions;

// ✅ Async Logout Thunk (Fixes Firebase Logout Issue)
export const logoutUser = () => {
    return async (dispatch: AppDispatch) => {
        try {
            await auth().signOut(); // 🔹 Sign out from Firebase
            dispatch(logout()); // 🔹 Reset Redux state
        } catch (error) {
            console.error('Logout Error:', error);
        }
    };
};

// ✅ Thunk for Login with Email/Password
export const loginWithEmailPassword = (email: string, password: string, userType : 'user' | 'merchant'| 'driver') => {
    return async (dispatch: AppDispatch) => {
        dispatch(loginStart());
        try {
            console.log('Login with Email/Password');
            await axiosInstance.post('/users/login',{email,password, userType})
            .then((response)=>{
                console.log('Response : ',response.data);
                // Ensure response.data.user might have _id or other new fields
                dispatch(loginSuccess({...response.data.user,token : response.data.token}));
            });

        } catch (error: unknown) {

            console.log('Error : ',error);
            if(error instanceof AxiosError){
                console.log(error.response?.data);
                dispatch(loginFailure(error.response?.data));
            }
            else if (error instanceof Error) {
                dispatch(loginFailure(error.message));
                throw error;
            } else {
                dispatch(loginFailure('An unknown error occurred.'));
                throw new Error('An unknown error occurred.');
            }
        }
    };
};

// ✅ Thunk for User Registration
export const registerWithEmailPassword = (userData: PersonalInfoData) => {
    return async (dispatch: AppDispatch) => {
        console.log('Registering User');
        dispatch(loginStart());

        try {
            console.log('sending Data');
            const response = await axiosInstance.post('/users/register',userData);

            // When registering, the backend response might contain the full user object including _id.
            // Make sure this is passed to registerStart.
            dispatch(registerStart({
                _id: response.data.user?._id, // <--- Ensure _id is passed from backend response
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                country: userData.country,
                state: userData.state,
                zipCode: userData.zipCode,
                userType: userData.userType,
                token: response.data.token,
                stripeCustomerId: response.data.user?.stripeCustomerId, // Pass stripeCustomerId if returned
            }));
            return response;
        } catch (error: unknown) {
            if(error instanceof AxiosError){
                console.log(error.response?.data);
            }
            if (error instanceof Error) {
                dispatch(loginFailure(error.message));
                throw error;
            } else {

                dispatch(loginFailure('An unknown error occurred.'));
                throw new Error('An unknown error occurred.');
            }
        }
    };
};

export const verifyOTP = (otp: string, token: string)=> async (dispatch : AppDispatch)=>{
    try{
        console.log('Token : ',token);
        // if(!token) throw new Error("Token not found"); // Unnecessary comment, token is already checked by TS if not undefined
        const response = await axiosInstance.post('/users/verify-otp',{otp}, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token, // Assuming token format is "Bearer <token>" or similar handled by axiosInstance
            },
            withCredentials: true,
        });
        console.log(response.data);
        dispatch(verifySuccess());
    }catch(error){
        if(error instanceof AxiosError){
            console.log(error.response?.data);
            throw new Error(error.response?.data);
        }
        throw error;
    }finally{
        // remove in Production;
        dispatch(verifySuccess()); // This line ensures verifySuccess is dispatched even on error.
                                // This might be intended for immediate UI update but review if it's
                                // correct behavior on actual OTP failure.
    }
};

// ✅ Auth State Change Listener
export const initAuthListener = () => {
    return (dispatch: AppDispatch) => {
        auth().onAuthStateChanged(async (user) => {
            if (user) {
                const userSnapshot = await database()
                    .ref(`users/${user.uid}`)
                    .once('value');

                // Ensure userData from Firebase also matches PersonalInfoData including _id
                const userData = userSnapshot.exists() ? (userSnapshot.val() as PersonalInfoData) : null;

                if (userData) {
                    dispatch(loginSuccess(userData));
                } else {
                    dispatch(logout());
                }
            } else {
                dispatch(logout());
            }
        });
    };
};

const LOGIN_STATE_KEY = 'loginKey';
export async function getAuthFromAsyncStorage():Promise<AuthState>{
  let val = await AsyncStorage.getItem(LOGIN_STATE_KEY);
  if(val === null || val === '') {return {
    isAuthenticated : false,
    user : null,
    token : null,
    loading : false,
    error : null,
  };}
  let res = JSON.parse(val);
  return {
    isAuthenticated : res?.isAuthenticated || false,
    user : res.user || null ,
    token : res.token || null ,
    loading : false,
    error : null ,
  };
}
function saveAuthAtCache(state :Readonly<AuthState>){
    AsyncStorage.setItem(LOGIN_STATE_KEY,JSON.stringify(state),(err=>{
        if(err){console.log("Can't Save");}
        else {console.log('Saved Successfully');}
    }));
}
export default authSlice.reducer;
