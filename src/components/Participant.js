import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import withObservables from '@nozbe/with-observables';

const styles = StyleSheet.create({
  participant: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 20,
  },
  site: {
    justifyContent: 'flex-start',
  },
  type: {
    justifyContent: 'flex-end',
  },
});

const Participant = ({participant, navigation}) => {
  return (
    <TouchableOpacity
      style={styles.participant}
      onPress={() => navigation.navigate('Participant', {participant})}>
      <Text style={styles.title}>{participant.newId}</Text>
      <View style={styles.details}>
        <Text style={styles.site}>{participant.site}</Text>
        <Text style={styles.type}>{participant.participantType}</Text>
      </View>
    </TouchableOpacity>
  );
};

Participant.propTypes = {
  participant: PropTypes.shape({
    newId: PropTypes.number.isRequired,
    site: PropTypes.string.isRequired,
    participantType: PropTypes.string.isRequired,
  }).isRequired,
};

export default withObservables(['participant'], ({participant}) => ({
  participant,
}))(Participant);
