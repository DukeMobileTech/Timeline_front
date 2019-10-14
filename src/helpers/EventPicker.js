import React from 'react';
import RNPickerSelect from 'react-native-picker-select';
import {
  educationLevels,
  moveTypes,
  abuseTypes,
  relationshipStatus,
  mentalHealth,
  EDUCATION,
  MOVES,
  ABUSE,
  RELATIONSHIP_STATUS,
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
    case ABUSE:
      return <EventPicker value={value} eventTypes={abuseTypes} setValue={setDescription} />;
    case RELATIONSHIP_STATUS:
      return (
        <EventPicker value={value} eventTypes={relationshipStatus} setValue={setDescription} />
      );
    case MENTALHEALTH:
      return <EventPicker value={value} eventTypes={mentalHealth} setValue={setDescription} />;
  }
};
