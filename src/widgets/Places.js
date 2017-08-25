import React, { Component, PropTypes } from 'react';

import {
  StyleSheet,
  Text,
  View,
  Dimensions
} from 'react-native';


const { width, height } = Dimensions.get('window');
const cols = 3, rows = 4;
const placesHeight = (height - 20 - 20) / rows - 135;

export default class Places extends Component {

    rectangle = () => {
        return {
            width: 145,
            height: 4,
            marginLeft: 15,
            backgroundColor: 'transparent',
            borderRadius: 5,
            borderWidth: 1,
            borderColor: 'white',
            // marginTop: placesHeight , // + 20,
            // position: 'absolute',
        }
    }
    rectangleFull = (max, now) => {
        return {
            width:  (145 / max) * now, //120,
            height: 3,
            // marginLeft: 15,
            backgroundColor: 'white',
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5,
            borderWidth: 1,
            borderColor: 'white',
            // marginTop: placesHeight + 20,
            // marginBottom: 0,
            // position: 'absolute',
        }
    }

    render() {
        const { now, max } = this.props;
 
        return <View>
            <View style={styles.row}>
                <Text style={styles.places}>Осталось мест</Text>
                <Text style={styles.black}>{now} / {max}</Text>
            </View>
            <View style={this.rectangle()} >
                <View style={this.rectangleFull(max, now)} />
            </View>
        </View>
    }
}

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        marginTop: 8,
    },
    black: {
        // ...defaultStyles.text,
        fontSize: 13,
        fontWeight: 'bold',
        // marginTop: placesHeight,
        marginLeft: 6,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    places: {
        // ...defaultStyles.text,
        fontSize: 13,
        
        // marginTop: placesHeight,
        
        marginLeft: 15,
        marginBottom: 2,
        color: '#FFFFFF',
        backgroundColor: 'rgba(0,0,0,0)',
    },
    bold: {
        fontWeight: 'bold'
    },
    // rectangle: {
    //     width: 145,
    //     height: 4,
    //     marginLeft: 15,
    //     backgroundColor: 'transparent',
    //     borderRadius: 5,
    //     borderWidth: 1,
    //     borderColor: 'white',
    //     marginTop: placesHeight + 20,
    //     position: 'absolute',
    // },
    // rectangleFull: {
    //     width: 120,
    //     height: 3,
    //     marginLeft: 15,
    //     backgroundColor: 'white',
    //     borderTopLeftRadius: 5,
    //     borderBottomLeftRadius: 5,
    //     borderWidth: 1,
    //     borderColor: 'white',
    //     marginTop: placesHeight + 20,
    //     position: 'absolute',
    // },
    
});

