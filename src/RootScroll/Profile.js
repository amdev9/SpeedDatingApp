import React, { Component } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';


import { defaultStyles } from '../styles';

const { width, height } = Dimensions.get('window');
export default class Profile extends Component {
  render() {
    const { user } = this.props;
    return (     
      <View style={styles.container}>
        <View style={styles.content}>  
        
          <View style={styles.avatar}>
            {/* <IconFontAwesome name="user-circle" size={100} color="rgba(0,0,0,.09)" /> */}
           <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
          </View>
          <Text style={styles.text}>
             {user.name} 
          </Text>

          <View style={styles.barContainer}>
            <View style={styles.rightSide}>
              <TouchableOpacity style={styles.circle}
                onPress={() => this.props.navigation.navigate('Settings', { user: user })}>
                <IconIonicons style={styles.setting} name="ios-settings" size={25} color="#c4c9d1" />
              </TouchableOpacity>
              <Text style={styles.barText}>Настройки</Text>
            </View>
            <View style={styles.leftSide}>
              <TouchableOpacity style={styles.circle}
                onPress={() => this.props.navigation.navigate('Edit', { user: user })}>
                <IconIonicons style={styles.setting} name="md-create" size={25} color="#c4c9d1" />
              </TouchableOpacity>
              <Text style={styles.barText}>ИЗМЕНИТЬ</Text>
            </View>
          </View>

        </View> 
       </View> 
    );
  }
}

const iconStyles = {
  borderRadius: 10,
  iconStyle: { paddingVertical: 5 },
};

const styles = StyleSheet.create({
  // header styles
  barText: {
    color: "#c4c9d1",
    fontWeight: 'bold',
    fontSize: 12,
    marginTop: 10,
  },
  barContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightSide: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSide: {
    margin: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  setting: {
    marginTop: 8,
    marginLeft: 11,
    backgroundColor: 'transparent'
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 40/2,
    backgroundColor: '#EFF3F7'
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF' // '#1EAAF1'
  },
  navBarButton: {
    color: '#262626',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 18,
    // marginTop: 7
  },
  container: {
    // flex: 1, // fixed 
    backgroundColor: '#FFF',
  },
  content: {
    
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    margin: 20,
  },
  avatarImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  text: {
    textAlign: 'center',
    color: '#4b4d5c',
    marginBottom: 5,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Avenir'
    // ...defaultStyles.text,
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});


