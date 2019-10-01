import React from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {database} from '../../App';

export default DatePicker = ({event, isVisible, setVisible}) => {
  const date = event ? event.time : new Date();

  const hideDateTimePicker = () => {
    setVisible();
    isVisible = false;
  };

  handleDatePicked = async date => {
    await database.action(async () => {
      await event.update(evt => {
        evt.time = date.getTime();
      });
    });
    hideDateTimePicker();
  };

  return (
    <DateTimePicker
      date={date}
      isVisible={isVisible}
      onConfirm={handleDatePicked}
      onCancel={hideDateTimePicker}
    />
  );
};
