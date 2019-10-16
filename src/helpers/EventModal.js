import React, {useState} from 'react';
import Modal from 'react-native-modal';
import {View, Text, StyleSheet, TextInput} from 'react-native';
import {whiteColor, eventTypes, greenColor} from './Constants';
import Event from '../models/Event';
import {Button} from 'react-native-elements';
import DateTimePicker from 'react-native-modal-datetime-picker';
import {EventDescription, EventPicker} from './EventPicker';
import {database} from '../../App';
import {YellowBox} from 'react-native';
import uuid from 'react-native-uuid';

// TODO: Remove when issue fixed
YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps is deprecated']);

export default EventModal = ({participant, event, interviews, isVisible, setVisible}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [title, setTitle] = useState(event === null ? null : event.title);
  const [description, setDescription] = useState(event === null ? null : event.description);
  const [time, setTime] = useState(event === null ? null : event.time);
  const [buttonTitle, setButtonTitle] = useState(time === null ? 'Select Time' : time);

  const handleSave = async () => {
    interviews = interviews.sort((a, b) => a.interviewDate - b.interviewDate);
    let interview = interviews[interviews.length - 1];
    const insterviewsAfter = interviews.filter(inter => inter.interviewDate >= time);
    if (insterviewsAfter.length > 0) interview = insterviewsAfter[0];

    if (event === null && title !== null && description !== null && time != null) {
      await database.action(async () => {
        const newEvent = await database.collections.get('events').create(event => {
          event.participantId = participant.remoteId;
          event.interviewIdentifier = interview.identifier;
          event.title = title;
          event.description = description;
          event.time = time;
          event.uuid = uuid.v4();
        });
        setVisible(newEvent);
      });
    }
  };

  const handleCancel = () => {
    setVisible(null);
  };

  const handleDatePicker = () => {
    setShowDatePicker(true);
  };

  const hideDateTimePicker = () => {
    setShowDatePicker(false);
  };

  handleDatePicked = date => {
    setTime(date.getTime());
    setButtonTitle(date.toLocaleDateString());
    hideDateTimePicker();
  };

  handleEventTypeChange = value => {
    setTitle(value);
    setDescription(null);
  };

  return (
    <Modal isVisible={isVisible}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <View style={{backgroundColor: whiteColor, padding: 10}}>
          <View style={styles.item}>
            <Text style={styles.label}>Type</Text>
            <View style={styles.input}>
              <EventPicker value={title} eventTypes={eventTypes} setValue={handleEventTypeChange} />
            </View>
          </View>
          <View style={styles.item}>
            <Text style={styles.label}>Time</Text>
            <View style={styles.input}>
              <Button title={buttonTitle} onPress={handleDatePicker} />
            </View>
          </View>
          {title !== null && (
            <View style={styles.item}>
              <Text style={styles.label}>Description</Text>
              <View style={styles.input}>
                <EventDescription
                  value={description}
                  title={title}
                  setDescription={setDescription}
                />
              </View>
            </View>
          )}
          <View style={styles.item}>
            <Button title="Cancel" type="outline" onPress={handleCancel} />
            <Button title="Save" buttonStyle={{backgroundColor: greenColor}} onPress={handleSave} />
          </View>
        </View>
      </View>
      <DateTimePicker
        date={new Date()}
        isVisible={showDatePicker}
        onConfirm={handleDatePicked}
        onCancel={hideDateTimePicker}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    width: '25%',
    justifyContent: 'flex-start',
    fontSize: 28,
  },
  input: {
    width: '75%',
  },
});
