import axios from 'axios';
import {Platform} from 'react-native';

const baseURL = Platform.OS === 'ios' ? 'http://localhost:3000/' : 'http://10.0.2.2:3000/';

const getHeaders = async accessToken => {
  return {
    headers: {
      Accept: 'application/json',
      client: accessToken.client,
      uid: accessToken.uid,
      'Content-Type': 'application/json',
      'access-token': accessToken['access-token'],
    },
  };
};

export const getParticipants = async (accessToken, page) => {
  const headers = await getHeaders(accessToken);
  return await axios.get(`${baseURL}participants?page=${page}`, headers);
};

export const authURL = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  login: `${baseURL}auth/sign_in`,
  validate_token: `${baseURL}auth/validate_token`,
};
