import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from './styles';

export default class GenderModal extends Component {
  render() {
    const { goBack } = this.props.navigation;
    const {user} = this.props.navigation.state.params;
    return (
      // add two buttons with transparent checkbox icons
      // on press make checkbox with color and set value to clicked
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}></Text>
          <Text style={styles.navBarHeader}>Я</Text>
          <TouchableOpacity onPress={() =>  {
            this.props.navigation.navigate('Edit', { user: user });
          }}>
            <Text style={styles.navBarButton}>Готово</Text>
          </TouchableOpacity>
        </View>
       
      
          <ScrollView
              contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionHeader}></Text>
              <TouchableOpacity onPress={() =>  {
                console.log('onPress exit');
              }}>
              <Text style={styles.item}>Мужчина</Text>
              <Icon onPress={() => {
          console.log('check check')}
          } name="ios-checkmark" size={35} />
              </TouchableOpacity>
              <Text style={styles.sectionHeader}></Text>
              <TouchableOpacity onPress={() =>  {
                console.log('onPress exit');
              }}>
              <Text style={styles.item}>Женщина</Text>
              <Icon onPress={() => {
          console.log('check check')}
          } name="ios-checkmark" size={35} />
              </TouchableOpacity>
        </ScrollView>



        {/* <Button
            onPress={() => goBack()}
            title="Close Me"
        /> */}
      </View>
    );
  }
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    // alignItems: 'center',
    // justifyContent: 'center',
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
  header: {
    fontSize: 20,
    marginVertical: 20,
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

});