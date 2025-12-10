import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ServiceCard from './ServiceCard';

const DryCleaningServices = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { cleaner } = route.params;
  return (
    <View style={{ height: '100%' }}>
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

        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 30,
          }}
        >
          <TouchableOpacity onPress={() => navigation.navigate('Cleaners')}>
            <AntDesign name="arrowleft" color="orange" size={24} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: 'semibold' }}>
            From {cleaner.title}
          </Text>
        </View>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 20,
              flexDirection: 'row',
              gap: 10,
            }}
          >
            {cleaner.services.map((item, idx) => {
              return (
                <View
                  key={idx}
                  style={{
                    borderRadius: 10,
                    backgroundColor: 'gray',
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}
                  >
                    {item}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View
          style={{
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 10,
          }}
        >
          {/* Displaying all the services provided by the cleaner */}
          <ScrollView>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
              }}
            >
              {cleaner.serviceDescritption.map((service, idx) => (
                <ServiceCard
                  key={idx}
                  title={service.name}
                  price={service.price}
                />
              ))}
            </View>
          </ScrollView>
        
        </View>
      </View>
      <TouchableOpacity
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          backgroundColor: 'orange',
          alignSelf: 'center',
          position: 'absolute',
          bottom: 20,
          borderRadius: 30,
          width: '90%',
        }}
        onPress={() => navigation.navigate('Location', { cleaner })}
      >
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DryCleaningServices;

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
