import React, { Component, PropTypes } from 'react';

import {
  StyleSheet,
  Text,
  View
} from 'react-native';



export default class Sticker extends Component {
    render() {
      const { value } = this.props;
      
      return <Text> {value ? 'true' : 'false'} </Text>
    }
}

const styles = StyleSheet.create({});

