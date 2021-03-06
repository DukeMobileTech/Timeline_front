import React from 'react';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import {Database} from '@nozbe/watermelondb';
import DatabaseProvider from '@nozbe/watermelondb/DatabaseProvider';
import createNavigation from './src/helpers/Navigation';
import schema from './src/models/schema';
import Participant from './src/models/Participant';
import Interview from './src/models/Interview';
import Event from './src/models/Event';
import {StatusBar} from 'react-native';
import {darkPrimaryColor} from './src/helpers/Constants';
import {RefreshProvider} from './src/context/RefreshContext';
import {AccessTokenProvider} from './src/context/AccessTokenContext';

const adapter = new SQLiteAdapter({
  dbName: 'TimelineDb',
  schema,
});

export const database = new Database({
  adapter,
  modelClasses: [Participant, Interview, Event],
  actionsEnabled: true,
});

const Navigation = createNavigation();

const App = () => {
  return (
    <DatabaseProvider database={database}>
      <RefreshProvider>
        <AccessTokenProvider>
          <StatusBar backgroundColor={darkPrimaryColor} />
          <Navigation />
        </AccessTokenProvider>
      </RefreshProvider>
    </DatabaseProvider>
  );
};

export default App;
