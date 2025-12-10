import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { dryCleaners } from '../assets/assets';

import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';

const PopularCleaners = () => {
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
          <Ionicons name="wallet-outline" color="#000" size={24} />
          <Ionicons name="notifications-outline" color="#000" size={24} />
        </View>
      </View>
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            paddingVertical: 20,
            backgroundColor: 'white',
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>
            Popular Cleaners Nearby
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'orange' }}>
            SEE ALL
          </Text>
        </View>
        <ScrollView
          style={{ paddingTop: 10, paddingBottom: 20, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{paddingVertical:20}}>
            {dryCleaners.map((item, idx) => {
              return (
                <TouchableOpacity
                  key={idx}
                  delayPressIn={120} 
                  pressRetentionOffset={10}
                  onPress={() =>
                    navigation.navigate('DryCleanerDetail', { cleaner: item })
                  }
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 15,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    borderRadius: 20,
                    borderColor: '#bfc3c9',
                    borderWidth: 1,
                    marginBottom: 24,
                    gap: 5,
                    backgroundColor: 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 4,
                  }}
                >
                  <View
                    style={{
                      height: 40,
                      width: 40,
                      borderRadius: 20, // half of 30 → perfect circle
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: 'orange',
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'white',
                        fontSize: 20,
                      }}
                    >
                      D
                    </Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                      {item.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '300',
                        color: '#38383bff',
                      }}
                    >
                      {item.address}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 20,
                        width: '70%',
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Entypo name="location-pin" color="#000" size={15} />
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '300',
                            marginVertical: 5,
                            color: '#38383bff',
                          }}
                        >
                          {item.dist} miles
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <MaterialCommunityIcons
                          name="clock"
                          color="#000"
                          size={12}
                        />
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '300',
                            marginVertical: 5,
                            color: '#38383bff',
                          }}
                        >
                          {item.openTime}:00 AM - {item.closeTime}:00 PM
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Entypo name="star" color="orange" size={15} />
                    <Text style={{ color: 'black' }}>{item.rating}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default PopularCleaners;

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderBottomStartRadius: 30,
    borderBottomEndRadius: 30,
    paddingHorizontal: 20,
    width: '100%',

    top: 0,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 8,
  },
});
