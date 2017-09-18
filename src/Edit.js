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
  TouchableOpacity,
  Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { defaultStyles } from './styles';
import { put, get } from '../components/api';
var RNUploader = NativeModules.RNUploader;
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';

let styles
const { width,height } = Dimensions.get('window')


const AVATAR_URL = 'http://192.168.1.33:3000';

const URL = Platform.OS === 'android'
? 'http://10.0.3.2:3000' // works for Genymotion
: 'http://192.168.1.33:3000';
// : 'http://localhost:3000';


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
      about: user.about ? user.about  : '',
      age: user.age ? user.age  : '',
      gender: user.gender ? user.gender  : 0,

      work: user.work ? user.work  : '',
      university: user.university ? user.university  : '',
      current_work: user.current_work ? user.current_work  : '',
      current_university: user.current_university ? user.current_university  : '',
      
    }
  }

  saveProfile = async () => {
     
    const { user } = this.props.navigation.state.params;
    user.about = this.state.about;
    user.age = this.state.age;
    user.avatar = this.state.avatar;
    user.gender = this.state.gender;
    user.work = this.state.work;
    user.university = this.state.university;
    user.current_work = this.state.current_work;
    user.current_university = this.state.current_university;
    

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
 
  _picker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true
    }).then(image => {
      // console.log(image);
      
      let opts = {
        url: `${AVATAR_URL}/v1/`,
        files: [{
          name: image.filename,//'file',
          filename: _generateUUID() + '.png',
          filepath: image.path, //file.uri, // change to image.path
          filetype: 'image/png', // image.mime
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
          avatar: `${AVATAR_URL}/images/${JSON.parse(responseString).images}` 
        });
        // this.props.navigation.state.params.user.avatar = avatar; //.split(',')[0])
        this.setState({modalVisible: false});
      });
    });  
  }

  render() {
    const {user} = this.props.navigation.state.params;
    const { navigate } = this.props.navigation;
    
    console.log('edit ', user);
    
    // console.log('state :', this.state)
    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}></Text>
          <Text style={styles.navBarHeader}>Изменить</Text>
          <TouchableOpacity onPress={() =>  {
              this.saveProfile();
              navigate('ScrollTab', { user: user }); // Profile  goBack() // this.props.navigation.
          }}>
            <Text style={styles.navBarButton}>Готово</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
        <View style={styles.avatar}>
        <TouchableOpacity onPress={() => { 
          this._picker();

          {/* this.toggleModal(); this.getPhotos()  */}
          }}>
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
          
          <Text style={styles.sectionHeader}>Текущая работа</Text>
          <TouchableOpacity onPress={() => {

            
              return navigate('Work', { user: user })
            
            }
            
            }>
            <View style={styles.navBarTest}>
              <Text style={[styles.item, styles.itemTextChoose]}>{ (this.state.current_work == '') ? 'Добавить работу' : user.work.position_name }</Text>
              <Icon style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.sectionHeader}>Университет</Text>
          <TouchableOpacity onPress={() => navigate('University', { user: user })}>
            <View style={styles.navBarTest}>
              <Text style={[styles.item, styles.itemTextChoose]}>{ (this.state.current_university == '' ) ? 'Добавить университет' : user.university.school_name }</Text>
              <Icon style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
            </View>
          </TouchableOpacity>
          <Text style={styles.sectionHeader}><Text> </Text></Text>

        </ScrollView>


     
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
    fontSize: 17,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    padding: 10,
    fontSize: 18,
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
    fontSize: 18,
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
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold'
  },  
  closeButton: {
    color: '#3f88fb',
    textAlign:'center',
    // width: 64,
    fontSize: 18,
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

 