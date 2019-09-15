import * as React from 'react';
import { Text, View, StyleSheet, Button, Linking } from 'react-native';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import axios from 'axios';

import { BarCodeScanner } from 'expo-barcode-scanner';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
    scanned: false,
  };

  async componentDidMount() {
    this.getPermissionsAsync();
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  getPermissionsAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  render() {
    const { hasCameraPermission, scanned } = this.state;

    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'flex-end',
        }}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 200, height: 100, borderColor: scanned ? 'red' : 'yellow', borderWidth: 3, justifyContent: 'center', alignItems: 'center' }}>
            {scanned && (
              <Button
                title={'Tap to Scan Again'}
                onPress={() => this.setState({ scanned: false })}
              />
            )}
          </View>
        </View>


      </View>
    );
  }

  seachToGoogle = (data) => {
    const url = `https://www.google.com/search?q=${data}`
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));

  }

  seachToYandex = (data) => {
    //https://yandex.ru/search/?text=4602228001805
    const url = `https://yandex.ru/search/?text=${data}`
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }

  getInfoFromApi = (data) => {
    //http://www.ean13.info/api.php?code=4603172600007&key=xccvg55kh43jjf
    axios.get(`http://www.ean13.info/api.php?code=${data}&key=xccvg55kh43jjf`)
      .then(
        ({ data }) => {
          console.log(data);

        }
      )
      .catch(
        err => {
          console.error(err);

        }
      )
  }

  handleBarCodeScanned = ({ type, data }) => {
    this.setState({ scanned: true });
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
    console.log('handleBarCodeScanned', type, data);
    this.seachToGoogle(data);
    // this.seachToYandex(data);
    // this.getInfoFromApi(data)
  };
}
