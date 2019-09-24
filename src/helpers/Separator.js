import React from 'react';
import {View} from 'react-native';
import {grayColor} from './Constants';

export const Separator = () => {
  return (
    <View
      style={{
        height: 1,
        backgroundColor: grayColor,
        margin: 5,
      }}
    />
  );
};
