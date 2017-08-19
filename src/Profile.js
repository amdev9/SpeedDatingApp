import React, { Component } from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
  Text,
  Button,
  Image
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

 
export default class Profile extends Component {
  
  
  render() {
    const { user } = this.props.navigation.state.params;
    return (     
      

      
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.navBar}>
            <Text style={styles.navBarButton}></Text>
            <Text style={styles.navBarHeader}>My Profile</Text>
            {/* <Icon style={styles.navBarHeader} name="ios-person" size={30} color="#900" /> */}
            
            {/* <Text style={styles.navBarButton}
              onPress={() => this.props.navigation.navigate('Events', {
                person: user
              })}>
               Events
            </Text> */}


            <Icon style={styles.navBarButton}
              onPress={() => this.props.navigation.navigate('Events', {
                person: user
              })} name="ios-calendar-outline" size={30} color="#900" />

        


            
      
          </View>
          
          

          <Text style={styles.header}>
            Welcome {user.name}!
          </Text>
          <View style={styles.avatar}>
            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
            {/* <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" /> */}
          </View>
          <Text style={styles.text}>
             {user.name} {'\n'}
             {/* {JSON.stringify(this.props)} */}
             
          </Text>

          <Button
            onPress={() => this.props.navigation.navigate('Edit', { user: user })}
            title="Edit Profile"
          />
        
          
          
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
  navBar: {
    flexDirection: 'row',
    paddingTop: 30,
    height: 64,
    backgroundColor: '#FFFFFF' // '#1EAAF1'
  },
  navBarButton: {
    color: '#1EAAF1',
    textAlign:'center',
    width: 64
  },
  navBarHeader: {
    flex: 1,
    color: 'rgb(38,38,38)',//'#1EAAF1',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    // flex: 1, removed
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
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});


