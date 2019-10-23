import React, {useState, useContext} from 'react';
import {StyleSheet, KeyboardAvoidingView, TextInput, View, Dimensions} from 'react-native';
import {grayColor} from './Constants';
import {Button} from 'react-native-elements';
import axios from 'axios';
import {storeToken} from './Keychain';
import {authURL} from './API';
import {AccessTokenContext} from '../context/AccessTokenContext';
import {RefreshContext} from '../context/RefreshContext';

const deviceWidth = Dimensions.get('window').width;

export default Login = ({navigation}) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [token, setToken] = useContext(AccessTokenContext);
  const [refreshing, setRefreshing, shouldRefresh, setShouldRefresh] = useContext(RefreshContext);
  setRefreshing(false);
  setShouldRefresh(false);

  const login = () => {
    axios
      .post(
        authURL.login,
        {},
        {headers: Object.assign(authURL.headers, {email: email, password: password})}
      )
      .then(response => {
        let accessToken = {
          'access-token': response.headers['access-token'],
          client: response.headers.client,
          uid: response.headers.uid,
        };
        axios
          .get(authURL.validate_token, {headers: Object.assign(authURL.headers, accessToken)})
          .then(response => {
            if (response.data.success) {
              const success = storeToken(email, accessToken);
              if (success) {
                setToken(accessToken);
                setShouldRefresh(true);
                navigation.goBack();
              }
            }
          })
          .catch(error => {
            console.log('token validation error: ', error);
          });
      })
      .catch(error => {
        console.log('new session error: ', error);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          value={email}
          onChangeText={text => setEmail(text)}
        />
      </View>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          value={password}
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
      </View>
      <Button onPress={() => login()} title="Sign In" containerStyle={styles.buttonContainer} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  inputWrapper: {
    margin: 10,
  },
  input: {
    backgroundColor: grayColor,
    width: deviceWidth - 50,
    height: 50,
    marginHorizontal: 20,
    paddingLeft: 10,
    borderRadius: 10,
    fontSize: 22,
  },
  buttonContainer: {
    width: Math.floor(deviceWidth / 2),
    alignSelf: 'center',
  },
});
