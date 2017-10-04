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

import AccountKit, { LoginButton, Color, StatusBarStyle } from 'react-native-facebook-account-kit'

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
  

  configureAccountKit() {
    AccountKit.configure({
      theme: {
        //backgroundColor:       Color.rgba(0,120,0,0.1),
        //buttonBackgroundColor: Color.rgba(0, 153, 0, 1.00),
        //buttonDisabledBackgroundColor: Color.rgba(100, 153, 0, 0.5),
        //buttonBorderColor:     Color.rgba(0,255,0,1),
        //buttonTextColor:       Color.rgba(0,255,0,1),
        //headerBackgroundColor: Color.rgba(0, 153, 0, 1.00),
        //headerTextColor:       Color.rgba(0,255,0,1),
        //headerButtonTextColor: Color.rgba(0,255,0,1),
        //iconColor:             Color.rgba(0,255,0,1),
        //inputBackgroundColor:  Color.rgba(0,255,0,1),
        //inputBorderColor:      Color.hex('#ccc'),
        //inputTextColor:        Color.hex('#0f0'),
        //textColor:             Color.hex('#0f0'),
        //titleColor:            Color.hex('#0f0'),
        //backgroundImage:       "background.png",
        //statusBarStyle:        StatusBarStyle.LightContent,
      },
      //countryWhitelist: [ "AR", "BR", "US" ],
      //countryBlacklist: [ "BR" ],
      defaultCountry: "RU",
      // initialEmail: 'example.com',
      initialPhoneCountryPrefix: '+7',
      initialPhoneNumber: '',
    })
  }

  loginWithAccountKit = () => {
    console.log('loginWithAccountKit')
    this.configureAccountKit();
    AccountKit.loginWithPhone()
    .then((token) => {
      if (!token) {
        console.log('Login cancelled')
      } else {
        console.log(token)
        AccountKit.getCurrentAccount()
        .then((account) => {
          console.log(account)
        })
      }
    })

    
    // AccountKit.getCurrentAccount().then(account => {
    //   console.log(account);
       
    // })
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
              marginLeft: 15,
              marginRight: 15,
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
  borderColor: '#D8D8D8',

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
    fontSize: 9, 
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
