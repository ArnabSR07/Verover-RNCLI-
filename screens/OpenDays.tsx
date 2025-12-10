import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';

const OpenDays = () => {
  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  return (
    <View>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {days.map((day, idx) => {
          return (
            <View
              key={idx}
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 10,
                paddingHorizontal: 10,
                backgroundColor: '#FFE5B4',
                marginHorizontal:5,
                height:'auto',
                width:'auto',
                borderRadius:10,
                gap:5
              }}
            >
                <Text style={{fontSize:15,fontWeight:'semibold'}}>{day}</Text>
                <Text style={{fontSize:15,fontWeight:'semibold'}}>12:00 PM</Text>
                <Text style={{fontSize:15,fontWeight:'semibold'}}>|</Text>
                <Text style={{fontSize:15,fontWeight:'semibold'}}>5:00 PM</Text>
                <Text></Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default OpenDays;

const styles = StyleSheet.create({});
