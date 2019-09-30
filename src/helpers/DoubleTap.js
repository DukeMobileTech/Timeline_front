import React from 'react';
import {TouchableOpacity} from 'react-native';

export default DoubleTap = props => {
  const delay = 300;
  let lastTap = null;

  const handleDoubleTap = () => {
    const now = Date.now();
    if (lastTap && now - lastTap < delay) {
      props.onDoubleTap();
    } else {
      lastTap = now;
    }
  };

  return <TouchableOpacity onPress={handleDoubleTap}>{props.children}</TouchableOpacity>;
};
