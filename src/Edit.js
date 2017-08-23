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
  NativeModules,
  TextInput,
  Picker,
  TouchableOpacity
} from 'react-native';



import Icon from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from './styles';
import { put, get } from '../components/api';
var RNUploader = NativeModules.RNUploader;
import RNFetchBlob from 'react-native-fetch-blob'

let styles
const { width,height } = Dimensions.get('window')

class Edit extends React.Component {
 
  constructor(props) {
    super(props);
    const { user } = this.props.navigation.state.params;
    this.state = {
      modalVisible: false,
      photos: [],
      index: null,
       
      uploadProgress: 0,
      uploadTotal: 0,
      uploadWritten: 0,
      
      avatar: user.avatar ? user.avatar  : '',
      current_work: user.current_work ? user.current_work  : '',
      about: user.about ? user.about  : '',
      age: user.age ? user.age  : '',
      gender: user.gender ? user.gender  : 0
    }
  }

  saveProfile = async () => {
     
    const { user } = this.props.navigation.state.params;
    user.current_work = this.state.current_work;
    user.about = this.state.about;
    user.age = this.state.age;
    user.avatar = this.state.avatar;
    user.gender = this.state.gender;

    try {
      const response = await put('user', {
        user: user
      }); 
      const json = await response.json(); 
      console.log( JSON.stringify(json) );
      
      // events = json; // get events
      // this.props.navigation.goBack();
    }
    catch (error) {
      alert(error);
    }
  };


  

  // componentDidMount() {
  //   DeviceEventEmitter.addListener('RNUploaderProgress', (data) => {
  //     let bytesWritten = data.totalBytesWritten;
  //     let bytesTotal   = data.totalBytesExpectedToWrite;
  //     let progress     = data.progress;
  //     this.setState({
  //       uploadProgress: progress, 
  //       uploadTotal: bytesTotal, 
  //       uploadWritten: bytesWritten
  //     });
  //   });
  // }


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
    // let photos = this.state.photos;
    // photos.push(image);
    // this.setState({photos: photos});
    console.log('Uploading ..', image)

    // let files = this.state.photos.map( (file) => {
    //   return {
    //     name: 'file',
    //     filename: _generateUUID() + '.png',
    //     filepath: file.uri,
    //     filetype: 'image/png',
    //   }
    // });

    let opts = {
      url: 'http://localhost:3000/v1/',
      files: [{
        name: 'file',
        filename: _generateUUID() + '.png',
        filepath: image, //file.uri,
        filetype: 'image/png',
      }],//files,
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
      this.setState({ 
        avatar: 'http://localhost:3000/images/'  + JSON.parse(responseString).images 
      });
      // this.props.navigation.state.params.user.avatar = avatar; //.split(',')[0])
      this.setState({modalVisible: false});

    });
  }
  

  render() {
    const {user} = this.props.navigation.state.params;
    const { navigate } = this.props.navigation;
    
    console.log('state :', this.state)
    return (
      
      <View  style={styles.container}>

      {/* <Button
        title={'Save' }
        onPress={() => this.saveProfile()}
      /> 
          <Picker selectedValue = {this.state.user_sex} onValueChange = {this.updateUser}>
               <Picker.Item label = "Steve" value = "steve" />
               <Picker.Item label = "Ellen" value = "ellen" />
               <Picker.Item label = "Maria" value = "maria" />
            </Picker>
          <Text style = {styles.text_sex}>{this.state.user_sex}</Text>
        <Text style={styles.header}>
        </Text> */}

          <View style={styles.navBar}>
            <Text style={styles.navBarButton}></Text>
            <Text style={styles.navBarHeader}>Изменить</Text>
            <TouchableOpacity onPress={() =>  {
                  this.saveProfile();
                  this.props.navigation.navigate('Profile', { user: user });
            }}>
              <Text style={styles.navBarButton}>Готово</Text>
            </TouchableOpacity>
          </View>
        
        
        
        <View style={styles.content}>
        {/* <Text> {user.name} </Text> */}
        <View style={styles.avatar}>
          
        <TouchableOpacity onPress={() => { this.toggleModal(); this.getPhotos() }}>
            <Image source={{ uri: this.state.avatar }} style={styles.avatarImage} />  
            <View style={styles.circle}>
              <Icon style={styles.setting} name="md-create" size={20} color="#FFFF" /> 
              {/* c4c9d1 */}
              </View>
          </TouchableOpacity>
  
            {/* <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" /> */}
        </View>
      </View>

        <ScrollView
              contentContainerStyle={styles.scrollContent}>
              <Text style={styles.sectionHeader}><Text>О пользователе {user.name} </Text></Text>
              <TextInput style={styles.item} onChangeText={(about) => this.setState({ about })}
                value={this.state.about}/>
              <Text style={styles.sectionHeader}>Я</Text>
              
              <TouchableOpacity onPress={() => navigate('Gender', { user: user })}>

              <View style={styles.navBarTest}>
                <Text style={[styles.item, styles.itemTextChoose]}>{ (this.state.gender == 2) ? 'Мужчина' : 'Женщина'}</Text>
                <Icon style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
              </View>
              </TouchableOpacity>
              <Text style={styles.sectionHeader}><Text> </Text></Text>

        </ScrollView>


        {/* <Button
        title='View Photos'
        onPress={() => { this.toggleModal(); this.getPhotos() }}
        />  

        current work   
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(current_work) => this.setState({ current_work })}
          value={this.state.current_work}
        />
         about user info   
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(about) => this.setState({about})}
          value={this.state.about}
        />
        
          age  
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(age) => this.setState({age})}
          value={this.state.age}
        />

       <Button
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
        <TouchableOpacity onPress={this.toggleModal}>
          <Text style={styles.closeButton}>Закрыть</Text>
        </TouchableOpacity>
        {/* <Button
            title='Close'
            onPress={this.toggleModal}
          />   */}
          <ScrollView
            contentContainerStyle={styles.scrollView}>
            {
              this.state.photos.map((p, i) => {
                return (
                  <TouchableHighlight
                    underlayColor="#9575CD"
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
              <TouchableOpacity onPress={this.upload}>
                <Text style={styles.uploadButton}>Загрузить</Text>
                </TouchableOpacity>
                {/* <Button
                    title='Upload'
                    onPress={this.upload}
                  /> */}
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
  
  sectionHeader: {
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 15,
    height: 44,
    fontFamily: 'System',
    textAlign: 'left',
  },
  navBarTest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width - 20
  },
  itemTextChoose: {
    padding: 12,
    fontSize: 15,
    fontFamily: 'System',
    fontWeight: 'bold',
    color: '#a5a9af',
  },
  itemIconChoose: {
  
    marginTop: 10
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 30/2,
    backgroundColor: '#3f88fb', //'#EFF3F7',
    position: 'absolute',
    marginTop: 70,
    marginLeft: 70,
  },
  setting: {
    marginTop: 5,
    marginLeft: 8,
    backgroundColor: 'transparent'
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
    width: 64,
    fontSize: 15,
    fontWeight: 'bold'
  },
  navBarHeader: {
    flex: 1,
    color: '#262626',
    fontWeight: 'bold',
    textAlign: 'center',
    ...defaultStyles.text,
    fontSize: 15,
    // marginTop: 5
  },
  // text_sex: {
  //   fontSize: 30,
  //   alignSelf: 'center',
  //   color: 'red'
  // },
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FFF'
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
  uploadButton: {
    color: '#3f88fb',
    textAlign:'center',
    // width: 64,
    fontSize: 15,
    marginBottom: 20,
    fontWeight: 'bold'
  },  
  closeButton: {
    color: '#3f88fb',
    textAlign:'center',
    // width: 64,
    fontSize: 15,
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold'
  }, 
  // content: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  content: {
    // flex: 1, removed
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

 