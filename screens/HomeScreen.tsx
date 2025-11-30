import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Rendermap from './Google_Map';

import { StyleSheet } from 'react-native';
import { Link } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    
    <View>
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
          <Ionicons name="notifications-outline" color="#000" size={24} />
          <Ionicons name="wallet-outline" color="#000" size={24} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{paddingTop:70}}>
       
      <View style={{ paddingHorizontal: 20,marginVertical:10,flexDirection:'row',gap:20,alignItems:'center' }}>
        <Ionicons name="arrow-back-outline" color="orange" size={24} />
        <Text style={{ fontSize: 20 }}>Locate Dry Cleaners</Text>
      </View>

      {/* Map Section */}

      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', height: 400, width: '100%' }}>
        <Rendermap />
      </View>

      <Text style={{ fontSize: 25, paddingHorizontal: 20, marginVertical: 20 }}>
        Location
      </Text>

      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <MaterialIcons name="location-history" color="orange" size={24} />
        <Text style={{ fontSize: 20 }}>Current Location</Text>
      </View>
      <Text
        style={{
          fontSize: 20,
          paddingHorizontal: 20,
          marginVertical: 20,
          color: 'orange',
        }}
      >
        Use Current Location
      </Text>
      <View
        style={{
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          style={{
            paddingHorizontal: 55,
            paddingVertical: 20,
            borderRadius: 30,
            backgroundColor: 'black',
          }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            Apply
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
         onPress={() => navigation.navigate('Cleaners')}
          style={{
            paddingHorizontal: 45,
            paddingVertical: 20,
            borderRadius: 30,
            backgroundColor: 'orange',
          }}
        >
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
            Continue
          </Text>
        </TouchableOpacity>
        
      </View>
      <Text
        style={{ paddingHorizontal: 20, color: 'gray', marginVertical: 15 }}
      >
        Disclaimer that poor connection and other unforeseen events may delay
        your purchase or conformation of the dry cleaners.
      </Text>
      <View>
      <Text style={{marginVertical:10,flexDirection:'row',alignItems:'center',justifyContent:'center',fontSize:15,fontWeight:'semibold',color:'orange',width:'100%',textAlign:'center'}}>ORDER HISTORY</Text>
      </View>
       </ScrollView>
    </View>
   
  );
};




export default HomeScreen;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    paddingVertical: 10,
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
  mapContainer: {
    width: '100%',
    height: '60%',

    marginVertical: 20,
  },
});