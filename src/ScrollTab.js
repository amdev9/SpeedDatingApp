import React from 'react';
import {
  Text,
  View,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

const ScrollTab = React.createClass({
  render() {
    return <ScrollableTabView
      style={{marginTop: 20, }}
      initialPage={0} 
      renderTabBar={() => <ScrollableTabBar />}
    >
      <View tabLabel='Profile'>
        <Text> My </Text>
      </View>
      <Text tabLabel='Events'>favorite</Text>
      <Text tabLabel='Mymatches'>project</Text>
    </ScrollableTabView>;
  },
});

export default ScrollTab;