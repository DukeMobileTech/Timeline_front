import * as Keychain from 'react-native-keychain';

export const readAccessToken = async () => {
  try {
    const credentials = await Keychain.getGenericPassword();
    return JSON.parse(credentials.password);
  } catch (error) {
    console.log('Could not read credentials, ' + error);
    return null;
  }
};

export const storeToken = async (username, token) => {
  try {
    return await Keychain.setGenericPassword(username, JSON.stringify(token));
  } catch (error) {
    console.log('Could not save credentials, ' + error);
  }
};

export const deleteToken = async () => {
  return await Keychain.resetGenericPassword();
};
