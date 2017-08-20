import React, { Component } from 'react';
import {
  Button,
  StyleSheet,
  Text,
  View
} from 'react-native';


export default class GenderModal extends Component {
  render() {
    const { goBack } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.header}>
            Hi, I'm a modal!
        </Text>
        <Button
            onPress={() => goBack()}
            title="Close Me"
        />
      </View>
    );
  }
}
    
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 20,
    marginVertical: 20,
  },
});