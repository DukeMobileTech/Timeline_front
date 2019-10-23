import React, {useEffect, useContext} from 'react';
import {FlatList, View} from 'react-native';
import {withDatabase} from '@nozbe/watermelondb/DatabaseProvider';
import withObservables from '@nozbe/with-observables';
import Participant from './Participant';
import remoteSync from '../helpers/Sync';
import {Separator} from '../helpers/Separator';
import {Q} from '@nozbe/watermelondb';
import {RefreshContext} from '../context/RefreshContext';
import {AccessTokenContext} from '../context/AccessTokenContext';

const Participants = ({participants, navigation}) => {
  const [token, setToken] = useContext(AccessTokenContext);
  const [refreshing, setRefreshing, shouldRefresh, setShouldRefresh] = useContext(RefreshContext);
  if (navigation.getParam('refresh')) {
    setShouldRefresh(true);
  } else {
    setShouldRefresh(false);
    setRefreshing(false);
  }

  useEffect(() => {
    const remoteRefresh = async () => {
      if (shouldRefresh) {
        if (token === null) {
          navigation.navigate('Login', {navigation});
        } else {
          if (!refreshing) {
            setRefreshing(true);
            try {
              await remoteSync(navigation, setToken, token, 1);
            } catch (error) {
              console.log('refresh error:', error);
              navigation.setParams({refresh: false});
            }
          }
        }
      }
    };
    remoteRefresh();
  }, [shouldRefresh]);

  return (
    <View style={{flex: 1}}>
      <FlatList
        data={participants}
        renderItem={({item: participant}) => (
          <Participant participant={participant} navigation={navigation} />
        )}
        keyExtractor={participant => `${participant.id}`}
        onRefresh={() => null}
        refreshing={refreshing}
        ItemSeparatorComponent={Separator}
      />
    </View>
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
          Q.where('identifier', Q.like(`%${Q.sanitizeLikeString(search)}%`))
        )
      ),
  }))(Participants)
);
