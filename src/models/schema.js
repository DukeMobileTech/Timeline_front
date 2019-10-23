import {appSchema, tableSchema} from '@nozbe/watermelondb';
import {PARTICIPANTS, INTERVIEWS, EVENTS} from '../helpers/Constants';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: PARTICIPANTS,
      columns: [
        {name: 'remote_id', type: 'number', isIndexed: true},
        {name: 'identifier', type: 'number', isIndexed: true},
        {name: 'participant_type', type: 'string'},
        {name: 'site', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'discarded_at', type: 'number', isOptional: true},
      ],
    }),
    tableSchema({
      name: INTERVIEWS,
      columns: [
        {name: 'remote_id', type: 'number', isIndexed: true},
        {name: 'identifier', type: 'number', isIndexed: true},
        {name: 'participant_identifier', type: 'number', isIndexed: true},
        {name: 'round', type: 'number'},
        {name: 'interview_date', type: 'number'},
        {name: 'age', type: 'number', isOptional: true},
        {name: 'grade', type: 'string', isOptional: true},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'discarded_at', type: 'number', isOptional: true},
      ],
    }),
    tableSchema({
      name: EVENTS,
      columns: [
        {name: 'remote_id', type: 'number', isIndexed: true},
        {name: 'interview_identifier', type: 'number', isIndexed: true},
        {name: 'participant_identifier', type: 'number', isIndexed: true},
        {name: 'uuid', type: 'string', isOptional: true},
        {name: 'title', type: 'string'},
        {name: 'description', type: 'string', isOptional: true},
        {name: 'time', type: 'number'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'discarded_at', type: 'number', isOptional: true},
      ],
    }),
  ],
});
