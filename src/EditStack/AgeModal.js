import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Picker
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


import { defaultStyles } from '../styles';

const { width, height } = Dimensions.get('window')


import { connect } from 'react-redux';
import { updateUser } from '../helpers/actions';
import _ from 'lodash';

@connect(
  state => ({
    events: state.events,
    loading: state.loading,
  }),
  dispatch => ({
    update_user: (user) => dispatch(updateUser(user)), 
  }),
)
export default class AgeModal extends Component {
  constructor(props) {
    super(props);
    const { user } = this.props.navigation.state.params;
    this.state = {
      age: user.age
    }
  }
    
  saveUser = async () => {
    const { user } = this.props.navigation.state.params;
     
    if(this.state.age == null) {
      user.age = '18';
    } else {
      user.age = this.state.age;
    }
    
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
          <Text style={styles.navBarHeader}>Возраст</Text>
          <TouchableOpacity onPress={() =>  {
            this.saveUser();
            this.props.navigation.navigate('Edit', { user: user });
          }}>
            <Text style={styles.navBarButton}>Готово</Text>
          </TouchableOpacity>
        </View>
       
        <ScrollView
          contentContainerStyle={styles.scrollContent}>
          

          <View style={styles.back}>
          <Picker
                selectedValue={this.state.age}
                onValueChange={(itemValue, itemIndex) => {
                        return this.setState({
                          age: itemValue
                        })
                    }
                }>{
                _.range(18, 30).map( (item, i) => {
                  var item_str = item.toString();
                  return <Picker.Item label={item_str} value={item_str} key={i} />
                })
                
              }</Picker>
          </View>
        </ScrollView>

      </View>
    );
  }
}
    
const styles = StyleSheet.create({
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
    // paddingTop: 2,
    // paddingLeft: 10,
    // paddingRight: 10,
    // paddingBottom: 2,
    // fontSize: 14,
    // fontWeight: 'bold',
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
