import React, {useState} from 'react';
import {FlatList} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import Participant from './Participant';
import remoteSync from '../helpers/Sync';
import {Separator} from '../helpers/Separator';
import {Q} from '@nozbe/watermelondb';

const Participants = ({participants, navigation}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const remoteRefresh = async () => {
    setIsRefreshing(true);
    await remoteSync();
    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={participants}
      renderItem={({item: participant}) => (
        <Participant participant={participant} navigation={navigation} />
      )}
      keyExtractor={participant => `${participant.id}`}
      onRefresh={() => remoteRefresh()}
      refreshing={isRefreshing}
      ItemSeparatorComponent={Separator}
    />
  );
};

export default withDatabase(
  withObservables(['search'], ({database, search}) => ({
    participants: database.collections
      .get('participants')
      .query(
        Q.where('discarded_at', null),
        Q.or(
          Q.where('site', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
          Q.where('participant_type', Q.like(`%${Q.sanitizeLikeString(search)}%`)),
          Q.where('new_id', Q.like(`%${Q.sanitizeLikeString(search)}%`))
        )
      ),
  }))(Participants)
);
