import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  TouchableHighlight
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


import { defaultStyles } from '../styles';



const { width,height } = Dimensions.get('window')

 
export default class Fullfill extends Component {
  //  1 - женский, 2 - мужской, 0 - без указания пола. 
  constructor(props) {
    super(props);
    const { user } = this.props.navigation.state.params;
    this.state = {
      gender: user.gender
    }
  }
    
  saveUser = async () => {
    const { user } = this.props.navigation.state.params;
    user.gender = this.state.gender;
    try {
      this.props.update_user(user);
    }
    catch (error) {
      alert(error);
    }
  };

  render() {
    const { goBack } = this.props.navigation;
    const {user} = this.props.navigation.state.params;
    return (
   
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}></Text>
          <Text style={styles.navBarHeader}>Я</Text>
          <TouchableOpacity onPress={() =>  {
            this.saveUser();
            this.props.navigation.navigate('Edit', { user: user });
          }}>
            <Text style={styles.navBarButton}>Готово</Text>
          </TouchableOpacity>
        </View>
       
         <View>
             <Text style={styles.title}>Меня зовут</Text>
             <TextInput
                style={{height: 40, borderColor: 'gray', borderWidth: 1}}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
            />
             </View>
            <TouchableHighlight onPress={}>Продолжить</TouchableHighlight>
      </View>
    );
  }
}
    
const styles = StyleSheet.create({

    title: {
        fontWeight: 'bold',
        fontSize: 20,
        color: 'black'
    },
  back: {
    marginTop: 30,
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
  },
  transparent: {
    color: 'transparent'
  },
  colorfull: {
    color: '#3f88fb'
  },
  navBarTest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 20
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
  header: {
    fontSize: 20,
    marginVertical: 20,
  },
  sectionHeader: {
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    fontFamily: 'System',
    textAlign:'center',
  },

});