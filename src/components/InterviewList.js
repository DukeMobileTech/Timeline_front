import React from 'react';
import {SafeAreaView, FlatList, Text, View, StyleSheet} from 'react-native';
import {Separator} from '../helpers/Separator';
import withObservables from '@nozbe/with-observables';

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
  },
  title: {
    fontSize: 28,
  },
  details: {
    flex: 1,
    flexDirection: 'row',
  },
  label: {
    justifyContent: 'flex-start',
    width: '50%',
    fontSize: 18,
  },
});

const Interview = ({interview}) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{interview.interviewDate.toLocaleDateString()}</Text>
      <View style={styles.details}>
        <Text style={styles.label}>Round</Text>
        <Text style={styles.label}>{interview.round}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Age</Text>
        <Text style={styles.label}>{interview.age}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Grade</Text>
        <Text style={styles.label}>{interview.grade}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>In Site Since</Text>
        <Text style={styles.label}>{interview.inSiteSince}</Text>
      </View>
      <View style={styles.details}>
        <Text style={styles.label}>Current Residence Type</Text>
        <Text style={styles.label}>{interview.currentResidenceType}</Text>
      </View>
    </View>
  );
};

const InterviewList = ({interviews}) => {
  interviews = interviews.sort((a, b) => (a.round > b.round ? 1 : -1));

  return (
    <SafeAreaView>
      <FlatList
        data={interviews}
        renderItem={({item: interview}) => <Interview interview={interview} />}
        keyExtractor={interview => `${interview.id}`}
        ItemSeparatorComponent={Separator}
      />
    </SafeAreaView>
  );
};

export default withObservables(['participant'], ({participant}) => ({
  participant,
  interviews: participant.interviews,
}))(InterviewList);
