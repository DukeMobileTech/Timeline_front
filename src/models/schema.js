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
        {name: 'participant_id', type: 'number', isIndexed: true},
        {name: 'round', type: 'number'},
        {name: 'interview_date', type: 'number'},
        {name: 'age', type: 'number'},
        {name: 'grade', type: 'string'},
        {name: 'in_site_since', type: 'number'},
        {name: 'current_residence_type', type: 'string'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'discarded_at', type: 'number', isOptional: true},
      ],
    }),
    tableSchema({
      name: EVENTS,
      columns: [
        {name: 'remote_id', type: 'number', isIndexed: true},
        {name: 'interview_id', type: 'number', isIndexed: true},
        {name: 'participant_id', type: 'number', isIndexed: true},
        {name: 'title', type: 'string'},
        {name: 'description', type: 'string'},
        {name: 'start', type: 'number'},
        {name: 'end', type: 'number'},
        {name: 'position', type: 'number'},
        {name: 'created_at', type: 'number'},
        {name: 'updated_at', type: 'number'},
        {name: 'discarded_at', type: 'number', isOptional: true},
      ],
    }),
  ],
});
