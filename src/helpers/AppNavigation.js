import React from "react";
import { Platform, StatusBar } from "react-native";

import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

const EditStack = StackNavigator({
    Edit: {
      screen: Edit,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Gender: {
      screen: GenderModal,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    University: {
      screen: UniversityModal,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Work: {
      screen: WorkModal,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
}, {
    mode: 'modal',
    headerMode: 'none',
});
  
export default ModalStack = StackNavigator({ 
    ScrollTab: { 
      screen: ScrollTab,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Settings: { 
      screen: SettingsScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Edit: { 
      screen: EditStack,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Confirmation: { 
      screen: Confirmation,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    ManagePermission: { 
      screen: ManagePermissionScreen,
      navigationOptions: {
        gesturesEnabled: false
      } 
    },
    // user 
    Join: { 
      screen: JoinScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    }, // fix??
    Voting: { 
      screen: VotingScreen,
      navigationOptions: {
        gesturesEnabled: false
      } 
    },
    VotePush: { 
      screen: VotePushScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    },   
    // manager
    Manage: { 
      screen: ManageScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    }, // fix??
    VotingStatus: { 
      screen: VotingStatusScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    Match: { 
      screen: MatchScreen,
      navigationOptions: {
        gesturesEnabled: false
      }
    },   
    
}, {
    mode: 'modal',
    headerMode: 'none',
});
  

// const AppWithNavigationState = ({ dispatch, nav }) => (
//     <ModalStack navigation={addNavigationHelpers({ dispatch, state: nav })} />
// );

// AppWithNavigationState.propTypes = {
//     dispatch: PropTypes.func.isRequired,
//     nav: PropTypes.object.isRequired,
// };

// const mapStateToProps = state => ({
//     nav: state.nav,
// });
// export default connect(mapStateToProps)(AppWithNavigationState);
