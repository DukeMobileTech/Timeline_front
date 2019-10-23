import {getParticipants} from './API';
import {database} from '../../App';
import {Q} from '@nozbe/watermelondb';
import {PARTICIPANTS, INTERVIEWS, EVENTS} from './Constants';
import {deleteToken, storeToken} from './Keychain';

const getExistingModelsByIds = async (tableName, ids) => {
  return await database.collections
    .get(tableName)
    .query(Q.where('remote_id', Q.oneOf(ids)))
    .fetch();
};

const setModelAttributes = (tableName, model, record) => {
  switch (tableName) {
    case PARTICIPANTS:
      model.remoteId = record.id;
      model.identifier = record.identifier;
      model.site = record.site;
      model.participantType = record.participant_type;
      model.discardedAt = record.discarded_at;
    case INTERVIEWS:
      model.remoteId = record.id;
      model.identifier = record.identifier;
      model.participantIdentifier = record.participant_identifier;
      model.round = record.round;
      model.interviewDate = record.interview_date;
      model.age = record.age;
      model.grade = record.grade;
      model.discardedAt = record.discarded_at;
    case EVENTS:
      model.remoteId = record.id;
      model.uuid = record.uuid;
      model.interviewIdentifier = record.interview_identifier;
      model.participantIdentifier = record.participant_identifier;
      model.title = record.title;
      model.description = record.description;
      model.time = record.time;
      model.discardedAt = record.discarded_at;
  }
};

const makeModel = (tableName, record, existingRecords) => {
  const recordToUpdate = existingRecords.find(exRecord => exRecord.remoteId === record.id);
  if (recordToUpdate) {
    return recordToUpdate.prepareUpdate(model => setModelAttributes(tableName, model, record));
  }

  return database.collections
    .get(tableName)
    .prepareCreate(model => setModelAttributes(tableName, model, record));
};

const remoteSync = async (navigation, setToken, token, page) => {
  try {
    const response = await getParticipants(token, page);
    let accessToken = {
      'access-token':
        response.headers['access-token'] === ''
          ? response.config.headers['access-token']
          : response.headers['access-token'],
      client: response.headers.client,
      uid: response.headers.uid,
    };
    storeToken(accessToken.uid, accessToken);
    setToken(accessToken);
    const links = response.headers.link.split(',');
    const totalLink = links.filter(link => link.split('>; ')[1] === 'rel="last"');
    const total = Number(totalLink[0].split('page=')[1].split('>;')[0]);
    const nextLink = links.filter(link => link.split('>; ')[1] === 'rel="next"');
    const next = Number(nextLink[0].split('page=')[1].split('>;')[0]);

    // Participants
    const participantIds = response.data.reduce((ids, participant) => {
      ids.push(participant.id);
      return ids;
    }, []);
    const existingParticipants = await getExistingModelsByIds(PARTICIPANTS, participantIds);
    const finalParticipants = response.data.map(record =>
      makeModel(PARTICIPANTS, record, existingParticipants)
    );

    // Interviews
    const interviewIds = response.data.reduce((ids, participant) => {
      participant.interviews.map(interview => {
        ids.push(interview.id);
      }, ids);
      return ids;
    }, []);
    const existingInterviews = await getExistingModelsByIds(INTERVIEWS, interviewIds);
    const interviewRecords = response.data.reduce((interviews, participant) => {
      participant.interviews.map(record => {
        interviews.push(record);
      }, interviews);
      return interviews;
    }, []);
    const finalInterviews = interviewRecords.map(record =>
      makeModel(INTERVIEWS, record, existingInterviews)
    );

    // Events
    const eventIds = response.data.reduce((ids, participant) => {
      participant.events.map(event => {
        ids.push(event.id);
      }, ids);
      return ids;
    }, []);
    const existingEvents = await getExistingModelsByIds(EVENTS, eventIds);
    const eventRecords = response.data.reduce((events, participant) => {
      participant.events.map(record => {
        events.push(record);
      }, events);
      return events;
    }, []);
    const finalEvents = eventRecords.map(record => makeModel(EVENTS, record, existingEvents));

    database.action(async () => {
      try {
        await database.batch(...finalParticipants, ...finalInterviews, ...finalEvents);
      } catch (error) {
        console.log('!!error!!', error);
      }
    });

    if (next <= total) {
      await remoteSync(navigation, setToken, accessToken, next);
    } else {
      return;
    }
  } catch (error) {
    if (error.response.status === 401) {
      await deleteToken();
      navigation.navigate('Login', {navigation});
    }
  }
};

export default remoteSync;
