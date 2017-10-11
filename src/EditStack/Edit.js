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
  Platform,
  AsyncStorage
} from 'react-native';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-crop-picker';

import AccountKit, { LoginButton, Color, StatusBarStyle } from 'react-native-facebook-account-kit';


import { defaultStyles } from '../styles';


var RNUploader = NativeModules.RNUploader;
let styles
const { width,height } = Dimensions.get('window')


const USER_KEY = "auth-demo-key";


import { URL } from "../helpers/constants";


import { connect } from 'react-redux';
import { updateUser } from '../helpers/actions';

@connect(
  state => ({
    current_user: state.current_user
  }),
  dispatch => ({
    update_user: (user) => dispatch(updateUser(user)), 
  }),
)
class Edit extends React.Component {
 
  constructor(props) {
    super(props);
    const { current_user } = this.props;
    this.state = {
      modalVisible: false,
      photos: [],
      index: null,
       
      uploadProgress: 0,
      uploadTotal: 0,
      uploadWritten: 0,
      
      avatar: current_user.avatar 
    
    }
  }

  saveProfile = async (navigate) => {
    const { current_user } = this.props;
    current_user.avatar = this.state.avatar;

    try {
      console.log(current_user)
      this.props.update_user(current_user); 
      AsyncStorage.setItem(USER_KEY, JSON.stringify(current_user), () => {
        navigate('ScrollTab');
      }); 
      
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
  
      let opts = {
        url: `${URL}/v1/`,
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
         
        let status = res.status;
        let responseString = res.data;
        console.log(responseString)
        this.setState({ 
          avatar: `${URL}/images/${JSON.parse(responseString).images}` 
        });
  
        this.setState({modalVisible: false});
      });
    });  
  }
  
  configureAccountKit() {
    AccountKit.configure({
      theme: {
        //backgroundColor:       Color.rgba(0,120,0,0.1),
        //buttonBackgroundColor: Color.rgba(0, 153, 0, 1.00),
        //buttonDisabledBackgroundColor: Color.rgba(100, 153, 0, 0.5),
        //buttonBorderColor:     Color.rgba(0,255,0,1),
        //buttonTextColor:       Color.rgba(0,255,0,1),
        //headerBackgroundColor: Color.rgba(0, 153, 0, 1.00),
        //headerTextColor:       Color.rgba(0,255,0,1),
        //headerButtonTextColor: Color.rgba(0,255,0,1),
        //iconColor:             Color.rgba(0,255,0,1),
        //inputBackgroundColor:  Color.rgba(0,255,0,1),
        //inputBorderColor:      Color.hex('#ccc'),
        //inputTextColor:        Color.hex('#0f0'),
        //textColor:             Color.hex('#0f0'),
        //titleColor:            Color.hex('#0f0'),
        //backgroundImage:       "background.png",
        //statusBarStyle:        StatusBarStyle.LightContent,
      },
      //countryWhitelist: [ "AR", "BR", "US" ],
      //countryBlacklist: [ "BR" ],
      defaultCountry: "RU",
      // initialEmail: 'example.com',
      initialPhoneCountryPrefix: '+7',
      initialPhoneNumber: '',
    })
  }

  loginWithAccountKit = () => {
    console.log('loginWithAccountKit')
    this.configureAccountKit();
    AccountKit.loginWithPhone()
    .then((token) => {
      if (!token) {
        console.log('Login cancelled')
      } else {
        console.log(token)
        // accountId:"131545544257442"
        // appId:"806797486157972"
        // lastRefresh:1507134148578.6628
        // refreshIntervalSeconds:2592000
        // token:"EMAWdmhE1XsIV0ccTJlxqeBX66rUVPMHdZAFyJAXjTvOHLdeKoYDZCaaX58jfNq20r3ph3B95JPbd4ZCiAK9PWEFdi5Q1S3rEYeJkQhViowZDZD"

        
        AccountKit.getCurrentAccount()
        .then((account) => {
          console.log(account)
          // id:"131545544257442"
          // phoneNumber: {
          //   countryCode:"7"
          //   number:"9772563015"
          // }

          this.setState({
            phoneNumber: `+${account.phoneNumber.countryCode}${account.phoneNumber.number}` 
          })
          // saveProfile with account phone
        })
      }
    })
  }
  //
  render() {
    const { current_user } = this.props //.navigation.state.params;
    const { navigate } = this.props.navigation;
  
    return (
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navBarButton}></Text>
          <Text style={styles.navBarHeader}>Изменить</Text>
          <TouchableOpacity onPress={() => {
              this.saveProfile(navigate); // remove?
          }}>
            <Text style={styles.navBarButton}>Готово</Text>
          </TouchableOpacity>
        </View>
        
      
        <ScrollView
          contentContainerStyle={styles.scrollContent}>

          <View style={styles.content}>
        <View style={styles.avatar}>

      

        <TouchableOpacity onPress={() => { 
          this._picker();
        }}>
        {
          this.state.avatar 
          ? 
            <Image source={{ uri: this.state.avatar }} style={styles.avatarImage} />
          :
            <IconFontAwesome name="user-circle" size={100} color="rgba(0,0,0,.09)" /> 
        }
            
            <View style={styles.circle}>
              <IconIonicons style={styles.setting} name="md-create" size={20} color="#FFFF" /> 
            </View>
          </TouchableOpacity>
            {/* <Icon name="user-circle" size={100} color="rgba(0,0,0,.09)" /> */}
        </View>
      </View>



          <Text style={styles.sectionHeader}>Телефон</Text>
            <TouchableOpacity onPress={this.loginWithAccountKit}> 
              {/* // {() =>  navigate('PhoneNumber', { user: user })    }  */}

            <View style={styles.navBarTest}>
              <Text style={[styles.item, styles.itemTextChoose]}>{ current_user.phoneNumber ? current_user.phoneNumber : 'Указать телефон' }</Text>
              <IconIonicons style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
            </View>
          </TouchableOpacity>
          {/* <Text style={styles.sectionHeader}><Text>О пользователе {user.name} </Text></Text>
          <TextInput style={styles.item} onChangeText={(about) => this.setState({ about })}
            value={this.state.about}/> */}

          <Text style={styles.sectionHeader}>Пол</Text>
            <TouchableOpacity onPress={() => navigate('Gender')}>
            <View style={styles.navBarTest}>
              <Text style={[styles.item, styles.itemTextChoose]}>{ current_user.gender == 2 ? 'Мужчина' : 'Женщина'}</Text>
              <IconIonicons style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
            </View>
          </TouchableOpacity>
          
    

          <Text style={styles.sectionHeader}>Возраст</Text>
          {/* <TextInput style={styles.item} onChangeText={(about) => this.setState({ about })}
            value={this.state.about}/> */}
            
            <TouchableOpacity onPress={() => navigate('Age')}>
            <View style={styles.navBarTest}>
              <Text style={[styles.item, styles.itemTextChoose]}>{ current_user.age ? current_user.age : 'Добавить возраст'}</Text>
              <IconIonicons style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
            </View>
          </TouchableOpacity>


          <Text style={styles.sectionHeader}>Текущая работа</Text>
          <TouchableOpacity onPress={() => {            
              return navigate('Work')
            }  
          }>
            <View style={styles.navBarTest}>
              <Text style={[styles.item, styles.itemTextChoose]}>{ current_user.current_work ? current_user.work.position_name : 'Добавить работу' }</Text>
              <IconIonicons style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
            </View>
          </TouchableOpacity>
          
          <Text style={styles.sectionHeader}>Университет</Text>
          <TouchableOpacity onPress={() => navigate('University')}>
            <View style={styles.navBarTest}>
              <Text style={[styles.item, styles.itemTextChoose]}>{ current_user.current_university ? current_user.university.school_name : 'Добавить университет' }</Text>
              <IconIonicons style={styles.itemIconChoose } name="ios-arrow-forward" size={25} color="#c4c9d1" />
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

 