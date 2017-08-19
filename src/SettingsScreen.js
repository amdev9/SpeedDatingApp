import React, { Component } from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Button,
  CameraRoll,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  TextInput,
  Picker
} from 'react-native'



class Settings extends Component {
   
  render() {
    const {user} = this.props.navigation.state.params;
    return (
        <View style={styles.container}>
            <Text> Settings screen </Text>
            <Text> show exit button </Text>
        </View>
    )
  }
}


styles = StyleSheet.create({
  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  

});

export default Settings

 