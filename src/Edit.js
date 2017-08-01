import React from 'react'

import {
  View,
  Text,
  TouchableHighlight,
  Modal,
  StyleSheet,
  Button,
  CameraRoll,
  Image,
  Dimensions,
  ScrollView,
  RefreshControl,
  NativeModules
} from 'react-native'

var RNUploader = NativeModules.RNUploader;

// import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'

let styles
const { width } = Dimensions.get('window')

class Edit extends React.Component {
  static navigationOptions = {
    title: 'Camera Roll App',
  }

  state = {
    modalVisible: false,
    photos: [],
    index: null
  }

  setIndex = (index) => {
    if (index === this.state.index) {
      index = null
    }
    this.setState({ index })
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All'
    })
    .then(r => this.setState({ photos: r.edges }))
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }

  upload = () => {
    const image = this.state.photos[this.state.index].node.image.uri;
    let photos = this.state.photos;
    photos.push(image);
    this.setState({photos: photos});
    console.log('Uploading ..', image)

    let files = this.state.photos.map( (file) => {
      return {
        name: 'file',
        filename: _generateUUID() + '.png',
        filepath: file.uri,
        filetype: 'image/png',
      }
    });

    let opts = {
      url: 'http://localhost:3000/',
      files: files,
      params: {name: 'test-app'}
    };

  
    RNUploader.upload(opts, (err, res) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(res);
      let status = res.status;
      let responseString = res.data;
      console.log('Upload complete with status ' + status);
      console.log(responseString);
       
    });
  }
  
 
 

  // navigate = () => {
  //   const { navigate } = this.props.navigation;
  //   navigate('ImageBrowser')
  // }

  // share = () => {
  //   const image = this.state.photos[this.state.index].node.image.uri
  //   RNFetchBlob.fs.readFile(image, 'base64')
  //   .then((data) => {
  //     let shareOptions = {
  //       title: "React Native Share Example",
  //       message: "Check out this photo!",
  //       url: `data:image/jpg;base64,${data}`,
  //       subject: "Check out this photo!"
  //     };

  //     Share.open(shareOptions)
  //       .then((res) => console.log('res:', res))
  //       .catch(err => console.log('err', err))
  //   })
  // }



  render() {
    const {user} = this.props.navigation.state.params;
    console.log('state :', this.state)
    return (
      <View style={styles.container}>

        <Text style={styles.header}>
            Edit {user.avatar}
          </Text>
          <View style={styles.avatar}>
             {/* <Image source={{ uri: 'http://localhost:8000/images/597f6c1b80135404074684a9' }} style={styles.avatarImage} />  */}
            {/* <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" /> */}
          </View>
          <Text style={styles.text}>
             Editing {'\n'}
             {/* {JSON.stringify(this.props)} */}
             
          </Text>

        <Button
          title='View Photos'
          onPress={() => { this.toggleModal(); this.getPhotos() }}
        />
        {/* <Button
          title='Browse Images'
          onPress={this.navigate}
        /> */}
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => console.log('closed')}
        >
          <View style={styles.modalContainer}>
            <Button
              title='Close'
              onPress={this.toggleModal}
            />
            <ScrollView
              contentContainerStyle={styles.scrollView}>
              {
                this.state.photos.map((p, i) => {
                  return (
                    <TouchableHighlight
                      style={{opacity: i === this.state.index ? 0.5 : 1}}
                      key={i}
                      underlayColor='transparent'
                      onPress={() => this.setIndex(i)}
                    >
                      <Image
                        style={{
                          width: width/3,
                          height: width/3
                        }}
                        source={{uri: p.node.image.uri}}
                      />
                    </TouchableHighlight>
                  )
                })
              }
            </ScrollView>
            {
              this.state.index !== null  && (
                <View style={styles.shareButton}>
                  <Button
                      title='Upload'
                      onPress={this.upload}
                    />
                </View>
              )
            }
          </View>
        </Modal>
      </View>
    )
  }
}


function _generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
};


styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  shareButton: {
    position: 'absolute',
    width,
    padding: 10,
    bottom: 0,
    left: 0
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
  }

});

export default Edit


// import React, { Component } from 'react';

// import {
//   ActivityIndicator,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   View,
//   Text,
//   Button,
//   Image
// } from 'react-native';

// import Icon from 'react-native-vector-icons/FontAwesome';
 
// export default class Edit extends Component {
  
//   // change user.name, user.avatar
//   // user.name -> textfield
//   // user.avatar -> upload new file with button -> set current img src to new
  
//   render() {
//     const {user} = this.props.navigation.state.params;
//     return (     
//       <View style={styles.container}>
//         <View style={styles.content}>
//           <Text style={styles.header}>
//             Edit 
//           </Text>
//           <View style={styles.avatar}>
//              <Image source={{ uri: 'http://localhost:8000/images/597f6c1b80135404074684a9' }} style={styles.avatarImage} /> 
//             {/* <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" /> */}
//           </View>
//           <Text style={styles.text}>
//              Editing {'\n'}
//              {/* {JSON.stringify(this.props)} */}
             
//           </Text>
//         </View>
//       </View>
//     );
//   }
// }

// const iconStyles = {
//   borderRadius: 10,
//   iconStyle: { paddingVertical: 5 },
// };

// const styles = StyleSheet.create({




