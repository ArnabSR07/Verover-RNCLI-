import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { dryCleaners } from '../android/app/src/assets/assets';

const PopularCleaners = () => {
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
          Popular Cleaners Nearby
        </Text>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'orange' }}>
          SEE ALL
        </Text>
      </View>
      <ScrollView style={{ paddingVertical: 10 }}>
       <View>
        {dryCleaners.map((item, idx) => {
          return (
            <View
              style={{
                paddingHorizontal: 10,
                paddingVertical: 10,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}
            >
              <View
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: '100',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor:'orange'
                }}
              >
                <Text style={{ fontWeight:'bold', color: 'white' }}>D</Text>
              </View>
              <View>
                <Text style={{fontSize:20,fontWeight:'bold'}}>{item.title}</Text>
                <Text style={{fontSize:10,fontWeight:'100'}}>{item.address}</Text>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style={{fontSize:10,fontWeight:'100'}}>{item.openTime} to {item.closeTime}</Text>
                </View>
              </View>
              <View>
                <Text style={{color:'black'}}>
                 {item.rating}
                </Text>
              </View>

            </View>
          );
        })}
      </View>
      </ScrollView>
      <Text>PopularCleaners</Text>
    </View>
  );
};

export default PopularCleaners;

const styles = StyleSheet.create({});
