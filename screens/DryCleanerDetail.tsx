import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';
import { useRoute } from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import OpenDays from './OpenDays';

const DryCleanerDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { cleaner } = route.params;
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('Cleaners')}>
          <AntDesign name="arrowleft" color="orange" size={24} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
          Dry Cleaners Detail Page
        </Text>
      </View>
      <ScrollView
        style={{ paddingVertical: 20 }}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
          <View
            style={{
              flexDirection: 'row',
              height: 250,
              backgroundColor: 'white',
              borderRadius: 20,
              marginVertical: 10,
            }}
          >
            <Text>logo image</Text>
          </View>
          <View
            style={{
              flex: 1,
              height: 200,
              justifyContent: 'flex-start',
              alignItems: 'center',
              backgroundColor: '#FFE5B4',
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 20,
              gap: 30,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: 10,
                width: '100%',
              }}
            >
              <View
                style={{
                  height: 60,
                  width: 60,
                  borderRadius: 30,
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

              {/* Shop name */}

              <View
                style={{
                  flex: 1,
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  flexWrap: 'wrap',
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: 'semibold' }}>
                  {cleaner.title}
                </Text>
                <Text>{cleaner.address}</Text>
              </View>

              {/* Rating */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Entypo name="star" color="orange" size={20} />
                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                  {cleaner.rating}
                </Text>
              </View>
              <View
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 10,
                }}
              >
                <AntDesign name="qrcode" color="#000" size={50} />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 15,
                width: '100%',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Entypo name="location-pin" color="#000" size={15} />
                <Text style={{ fontSize: 15, fontWeight: '300' }}>
                  {cleaner.dist} miles
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <MaterialCommunityIcons name="clock" color="#000" size={15} />
                <Text style={{ fontSize: 15, fontWeight: '300' }}>
                  {cleaner.openTime}:00 AM - {cleaner.closeTime}:00 AM
                </Text>
              </View>
            </View>
          </View>
          {/* About Section */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
              backgroundColor: 'white',
              marginVertical: 20,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
              About :
            </Text>
            <Text style={{ color: 'gray', fontSize: 15 }}>{cleaner.about}</Text>
          </View>

          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 20,
              backgroundColor: 'white',
              marginBottom: 20,
              borderRadius: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 8,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
              Contact Info
            </Text>
            <View
              style={{
                borderRadius: 10,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 15,
                backgroundColor: '#e5eae7ff',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  backgroundColor: 'gray',
                }}
              >
                <Entypo name="user" color="#000" size={20} />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                  }}
                >
                  Arnab Singha
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <MaterialCommunityIcons name="phone" color="#000" size={20} />
                  <Text style={{ color: 'gray', fontSize: 15 }}>
                    9832034489
                  </Text>
                </View>
              </View>
            </View>
            <View></View>
          </View>
          <View
            style={{
              paddingVertical: 20,
              paddingHorizontal: 18,
              height: 240,
              backgroundColor: 'white',
              marginBottom: 20,
              borderRadius: 20,
              gap: 10,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
              Availability
            </Text>

            <OpenDays />
          </View>
        </View>
      </ScrollView>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 30,
          width: '100%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: 'white',
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: 'orange',
            borderRadius: 40,
            paddingVertical: 15,
          }}
          onPress={() => navigation.navigate('Services',{cleaner})}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DryCleanerDetail;

const styles = StyleSheet.create({
  navbar: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
    gap: 40,
    backgroundColor: 'white',
  },
});
