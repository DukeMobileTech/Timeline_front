import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  educationLevels,
  moveTypes,
  traumaTypes,
  maritalEvents,
  wellbeingLevels,
  birthEvents,
  EDUCATION,
  MOVES,
  TRAUMA,
  MARRIAGE,
  WELLBEING,
  BIRTH,
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
    case MARRIAGE:
      return <EventPicker value={value} eventTypes={maritalEvents} setValue={setDescription} />;
    case WELLBEING:
      return <EventPicker value={value} eventTypes={wellbeingLevels} setValue={setDescription} />;
    case BIRTH:
      return <EventPicker value={value} eventTypes={birthEvents} setValue={setDescription} />;
  }
};
