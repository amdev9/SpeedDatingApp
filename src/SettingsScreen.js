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
  Picker,
  TouchableOpacity,
  ListView
} from 'react-native'

import { defaultStyles } from './styles';


class Settings extends Component {
   
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']), // add logout here
    };
  }

  render() {
    const {user} = this.props.navigation.state.params;
    return (

      <View style={styles.container}>
      <View style={styles.navBar}>
      <Text style={styles.navBarButton}></Text>
      <Text style={styles.navBarHeader}>Настройки</Text>
      <TouchableOpacity onPress={() =>  {
            {/* this.saveProfile(); */}
            this.props.navigation.navigate('Profile', { user: user });
      }}>
        <Text style={styles.navBarButton}>Готово</Text>
      </TouchableOpacity>
    </View>

        
            <Text> Settings screen </Text>
            <Text> show exit button </Text>

      <ListView
        dataSource={this.state.dataSource}
        renderRow={(rowData) => <Text>{rowData}</Text>}
      />
        </View>
    )
  }
}


styles = StyleSheet.create({
  
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
    backgroundColor: '#FFFFFF'
  },
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF' // '#1EAAF1'
  },
  navBarButton: {
    color: '#3f88fb',
    textAlign:'center',
    width: 64,
    fontSize: 15,
    fontWeight: 'bold'
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 15,
    // marginTop: 5
  },

});

export default Settings

 