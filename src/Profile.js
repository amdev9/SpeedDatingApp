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

import Icon from 'react-native-vector-icons/FontAwesome';
 
export default class Profile extends Component {
  
  render() {
    const {user} = this.props.navigation.state.params;
    return (     
      <View style={styles.container}>
        <View style={styles.content}>
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
            onPress={() => this.props.navigation.navigate('Movies')}
            title="Go to Movies"
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
  buttons: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    margin: 20,
    marginBottom: 30,
  },
});


