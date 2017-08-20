import React, { Component, PropTypes } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';



export default class Cost extends Component {
    render() {
      const { value } = this.props;
      
      return <Text> { value }  </Text>
    }
}

const styles = StyleSheet.create({});

