import React, { Component, PropTypes } from 'react';
import {
  Linking,
  StyleSheet,
  Platform,
  Text,
  View,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SafariView from 'react-native-safari-view';

import Screens from './Screens';
import { onSignIn } from "../helpers/auth";
import { ResetToSignedIn } from "../helpers/router";


const { width, height } = Dimensions.get('window');


import { URL } from "../helpers/constants";

export default class Login extends Component { 
  
  componentDidMount() {
    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  };

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    // Decode the user string and parse it into JSON
    const user = JSON.parse(decodeURI(user_string));
  
    onSignIn(user).then(() => this.props.navigation.dispatch(ResetToSignedIn)) // this.props.onLoggedIn(user); 

    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
    
  };

  // Handle Login with Facebook button tap
  loginWithFacebook = () => this.openURL(`${URL}/auth/facebook`);

  // Handle Login with Vk button tap
  loginWithVk = () => this.openURL(`${URL}/auth/vkontakte`);
  
  loginWithAccountKit = () => {
    console.log('loginWithAccountKit')
  }

  // Open URL in a browser
  openURL = (url) => {
    // Use SafariView on iOS
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: url,
        fromBottom: true,
      });
    }
    // Or Linking.openURL on Android
    else {
      Linking.openURL(url);
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Screens />
        
        
        {/* <View style={styles.avatar}>
            <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" />
          </View>
           */}


        <View style={styles.contentNew}>

          <View style={styles.buttons}>
            <Icon.Button
              name="facebook"
              backgroundColor="#3b5998"
              onPress={this.loginWithFacebook}
              {...iconStyles}
            >
              
              <Text style={styles.buttonText}>ВОЙТИ ЧЕРЕЗ FACEBOOK</Text> 
            </Icon.Button>
              
            <Icon.Button
              name="vk"
              backgroundColor="#45668e"
              onPress={this.loginWithVk}
              {...iconStyles}
            >
            <Text style={styles.buttonText}>ВОЙТИ ЧЕРЕЗ VK</Text> 
            </Icon.Button>

            {/* <View style={styles.borderSMS}> */}


            <View style={{
              marginLeft: 20,
              marginRight: 20,
              //width: 270
            }}>

            <Icon.Button
              //name="vk"
              backgroundColor="white"
              onPress={this.loginWithAccountKit}
              {...iconStylesSMS}
            >
              <Text style={styles.buttonTextSMS}>ВОЙТИ С ПОМОЩЬЮ НОМЕРА ТЕЛЕФОНА</Text> 
              </Icon.Button>
              </View>
          </View>

        </View>
      </View>
    );
  }
}


const iconStyles = {
  borderRadius: 30,
  iconStyle: { paddingVertical: 10 },
};
const iconStylesSMS = {
  borderRadius: 30,
  iconStyle: { paddingVertical: 3 },
  borderWidth: 1.5,
  borderColor: '#D8D8D8'
};
const styles = StyleSheet.create({
  buttonText: {
    fontFamily: 'System', 
    fontWeight: 'bold', 
    fontSize: 15, 
    color: 'white'
  },
  buttonTextSMS: {
    fontFamily: 'System', 
    // fontWeight: 'bold', 
    fontSize: 11, 
    color: '#A29F9F'
  },
 
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    flex: 1,
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
    color: '#333',
    marginBottom: 5,
  },
  contentNew: {
    height: 250,
    width: width
  },
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 30,
    marginRight: 30,
  },
   
});
