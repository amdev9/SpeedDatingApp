import React, { Component } from 'react'

import {
  SafariView,
  Linking,
  Platform,
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
  Picker,
  TouchableOpacity,
  SectionList,

} from 'react-native'

import { defaultStyles } from '../styles';
import { onSignOut } from "../helpers/auth";
import { ResetToSignedOut } from "../helpers/router";

import { URL } from "../helpers/constants";


import { connect } from 'react-redux';


@connect(
  state => ({
    current_user: state.current_user
  }),
  dispatch => ({}),
)
class Settings extends Component {

  logout = async () => {
    // add request ?
    onSignOut().then(() => this.props.navigation.dispatch(ResetToSignedOut))


    // try {
    // let response =  await fetch(`${URL}/logout`);
    // let responseJson = await response.json();
    // alert(responseJson);
    // if (responseJson == 'ok') {
    // } catch(error) {
    // console.error(error);
    // }
  }

  render() {
    const { current_user } = this.props //.navigation.state.params;
    return (

      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}></Text>
          <Text style={styles.navBarHeader}>Настройки</Text>
          <TouchableOpacity onPress={() => {
            this.props.navigation.goBack();
            //this.props.navigation.navigate('Profile', { user: user });
          }}>
            <Text style={styles.navBarButton}>Готово</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeader}></Text>
          <TouchableOpacity onPress={() => {
            this.logout();
          }}>
            <Text style={styles.item}>Выйти</Text>
          </TouchableOpacity>
          <Text style={styles.sectionHeader}></Text>
        </ScrollView>

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
    fontSize: 18,
    height: 44,
    fontFamily: 'System',
    textAlign: 'center',
  },

  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF' // '#1EAAF1'
  },
  navBarButton: {
    color: '#3f88fb',
    textAlign: 'center',
    width: 80,
    fontSize: 18,
    fontWeight: 'bold'
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 18,
    // marginTop: 5
  },

});

export default Settings

