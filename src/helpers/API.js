import axios from 'axios';
import {Platform} from 'react-native';

let instance;
if (Platform.OS === 'ios') {
  instance = axios.create({
    baseURL: 'http://localhost:3000/',
    responseType: 'json',
  });
} else {
  instance = axios.create({
    baseURL: 'http://10.0.2.2:3000/',
    responseType: 'json',
  });
}

export const getParticipants = () => {
  return instance.get('/participants');
};

export const getInterviews = () => {
  return instance.get('/interviews');
};

export const getEvents = () => {
  return instance.get('/events');
};
