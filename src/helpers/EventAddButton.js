import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default EventAddButton = props => {
  return (
    <View style={{alignItems: 'flex-end'}}>
      <Button
        onPress={() => props.handleClick()}
        raised
        icon={<MaterialIcons name="note-add" size={28} color="white" />}
      />
    </View>
  );
};
