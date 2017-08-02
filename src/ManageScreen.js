import React, { Component } from 'react';
import _ from 'lodash';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View, 
  ListView, 
  ScrollView,
  RefreshControl
} from 'react-native';
import { defaultStyles } from './styles';

import Participant from './Participant';

export default class ManageScreen extends Component {
    render() {
        
      const { event } = this.props.navigation.state.params;
      // Participant
      return (
        <View style={styles.container}>
            <ScrollView
                ref={(scrollView) => { this._scrollView = scrollView; }}
               
            >


                {event.participants.map((participant, index) => <Participant participant={participant} key={index} />)}
            </ScrollView>
        </View>
      );


    //    refreshControl={
    //                 <RefreshControl
    //                 refreshing={this.state.refreshing}
    //                 onRefresh={this.onRefresh}
    //                 />
    //             }


    //      <ListView
    //     dataSource={this.state.dataSource}
    //     renderRow={(rowData) => <Text>{rowData}</Text>}
    //   />
    //  );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    ...defaultStyles.text,
    color: '#333',
    fontSize: 20,
  },
  code: {
    ...defaultStyles.text,
    color: '#333',
    fontSize: 36,
  },
  buttonContainer: {
    alignItems: 'center',
    backgroundColor: '#673AB7',
    borderRadius: 100,
    margin: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  button: {
    ...defaultStyles.text,
    color: '#FFFFFF',
    fontSize: 18,
  },
});
