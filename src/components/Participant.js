import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import withObservables from '@nozbe/with-observables';

const styles = StyleSheet.create({
  participant: {
    backgroundColor: 'whitesmoke',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  subTitle: {
    fontSize: 20,
  },
  participantDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  participantSite: {
    justifyContent: 'flex-start',
    width: '50%',
  },
  participantType: {
    width: '50%',
  },
});

const Participant = ({participant, interviews, events, navigation}) => {
  return (
    <TouchableOpacity
      style={styles.participant}
      onPress={() => navigation.navigate('Participant', {participant, interviews, events})}>
      <Text style={styles.title}>{participant.newId}</Text>
      <View style={styles.participantDetails}>
        <View style={styles.participantSite}>
          <Text style={styles.subTitle}>{participant.site}</Text>
        </View>
        <View style={styles.participantType}>
          <Text style={styles.subTitle}>{participant.participantType}</Text>
        </View>
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
  interviews: participant.interviews,
  events: participant.events,
}))(Participant);
