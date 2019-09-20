import React, {useState} from 'react';
import {FlatList, StyleSheet, SafeAreaView} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import Participant from './Participant';
import remoteSync from '../helpers/Sync';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const ParticipantList = ({participants, navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const remoteRefresh = async () => {
    setIsRefreshing(true);
    await remoteSync();
    setIsRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={participants}
        renderItem={({item: participant}) => (
          <Participant participant={participant} navigation={navigation} />
        )}
        keyExtractor={participant => `${participant.id}`}
        onRefresh={() => remoteRefresh()}
        refreshing={isRefreshing}
      />
    </SafeAreaView>
  );
};

export default withDatabase(
  withObservables([], ({database}) => ({
    participants: database.collections
      .get('participants')
      .query()
      .observe(),
  }))(ParticipantList)
);
