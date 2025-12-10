import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {images} from '../../assets/images/images';
import {useNavigation} from '@react-navigation/native';
import { StackNavigationProp} from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigator/Routes';

const FeedbackConfirmation = () => {
 const navigation = useNavigation<NavigationProps>();
   type NavigationProps = StackNavigationProp<RootStackParamList>;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.checkmarkContainer}>
            <Image source={images.success} style={styles.checkmark} />
          </View>

          <Text style={styles.thankYouText}>Confirm</Text>
          <Text style={styles.feedbackText}>Drop Off</Text>

          <Text style={styles.appreciationText}>
           Your Items Are Successfully Dropped Off
          </Text>

          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => {
              navigation.navigate('LocateDryCleaning1');
            }}>
            <Text style={styles.exploreButtonText}>Ok</Text>
          </TouchableOpacity>
          <TouchableOpacity

            onPress={() => {
              navigation.navigate('ReceiptOfCompletion');
            }}>
            <Text style={styles.homeButtonText}>RECEIPT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  card: {
    width: width * 0.85,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    paddingVertical: 40,
  },
  checkmarkContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkmark: {
    width: 70,
    height: 70,
  },
  thankYouText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#000',
    marginBottom: 5,
  },
  feedbackText: {
    fontSize: 22,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
  },
  appreciationText: {
    fontSize: 18,
    color: '#808080',
    marginBottom: 40,
    textAlign: 'center',
  },
  exploreButton: {
    backgroundColor: '#FFA500',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '60%',
    alignItems: 'center',
    marginBottom: 15,
  },
  exploreButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#666666',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 30,
    width: '60%',
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#F59523',
    fontSize: 18,
    fontWeight: 'bold',
    top:15,
  },
});
export default FeedbackConfirmation;
