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
  SectionList,
  
} from 'react-native'

import { defaultStyles } from './styles';


class Settings extends Component {
   
  // constructor() {
  //   super();
  //   const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  //   this.state = {
  //     dataSource: ds.cloneWithRows(['row 1', 'row 2']), // add logout here
  //   };
  // }

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
        <SectionList 
          renderItem={({item}) => <Text style={styles.item}>{item}</Text>}
          renderSectionHeader={({section}) => <Text style={styles.sectionHeader}>{section.title}</Text>}
          sections={[
            { key: 1, title: ' ', data: ['Выйти'] },
            { key: 2, title: ' ', data: [] },
          ]}
          keyExtractor={(item, index) => index}
        />
      </View>
    )
  }
}


styles = StyleSheet.create({
  
  container: {
    flex: 1,
    // paddingTop: 22,
    // justifyContent: 'center',
    // alignItems: 'center'
    backgroundColor: '#FFFFFF'
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 15,
    height: 44,
    fontFamily: 'System',
    textAlign:'center',
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

 