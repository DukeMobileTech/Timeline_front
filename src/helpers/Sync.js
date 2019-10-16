import {getParticipants} from './API';
import {database} from '../../App';
import {Q} from '@nozbe/watermelondb';
import {PARTICIPANTS, INTERVIEWS, EVENTS} from './Constants';

const BATCH_SIZE = 4000;

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
  const recordToUpdate = existingRecords.find(exRecord => exRecord.remoteId == record.id);
  if (recordToUpdate) {
    return recordToUpdate.prepareUpdate(model => setModelAttributes(tableName, model, record));
  }

  return database.collections
    .get(tableName)
    .prepareCreate(model => setModelAttributes(tableName, model, record));
};

const chunkedRecords = records => {
  let result = [];
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    let chunk = records.slice(i, i + BATCH_SIZE);
    result.push(chunk);
  }
  return result;
};

const remoteSync = async () => {
  const response = await getParticipants();
  if (response.status !== 200) {
    throw new Error(await response.text());
  }

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
  const finalInterviews = response.data.reduce((interviews, participant) => {
    participant.interviews.map(record => {
      interviews.push(makeModel(INTERVIEWS, record, existingInterviews));
    }, interviews);
    return interviews;
  }, []);

  // Events
  const eventIds = response.data.reduce((ids, participant) => {
    participant.events.map(event => {
      ids.push(event.id);
    }, ids);
    return ids;
  }, []);
  const existingEvents = await getExistingModelsByIds(EVENTS, eventIds);
  const finalEvents = response.data.reduce((events, participant) => {
    participant.events.map(record => {
      events.push(makeModel(EVENTS, record, existingEvents));
    }, events);
    return events;
  }, []);
  return chunkedRecords([...finalParticipants, ...finalInterviews, ...finalEvents]).map(records => {
    database.action(async () => {
      await database.batch(...records);
    });
  });
};

export default remoteSync;
