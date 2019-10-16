import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  educationLevels,
  moveTypes,
  traumaTypes,
  relationshipStatus,
  mentalHealth,
  EDUCATION,
  MOVES,
  TRAUMA,
  RELATIONSHIPSTATUS,
  MENTALHEALTH,
} from './Constants';
import PickerSelectionStyles from './PickerSelectionStyles';

export const EventPicker = ({value, eventTypes, setValue}) => {
  return (
    <RNPickerSelect
      value={value}
      onValueChange={value => setValue(value)}
      items={eventTypes.map(type => ({label: type, value: type}))}
      useNativeAndroidPickerStyle={false}
      style={PickerSelectionStyles}
    />
  );
};

export const EventDescription = ({value, title, setDescription}) => {
  switch (title) {
    case EDUCATION:
      return <EventPicker value={value} eventTypes={educationLevels} setValue={setDescription} />;
    case MOVES:
      return <EventPicker value={value} eventTypes={moveTypes} setValue={setDescription} />;
    case TRAUMA:
      return <EventPicker value={value} eventTypes={traumaTypes} setValue={setDescription} />;
    case RELATIONSHIPSTATUS:
      return (
        <EventPicker value={value} eventTypes={relationshipStatus} setValue={setDescription} />
      );
    case MENTALHEALTH:
      return <EventPicker value={value} eventTypes={mentalHealth} setValue={setDescription} />;
  }
};
