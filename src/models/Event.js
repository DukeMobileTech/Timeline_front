import {Model} from '@nozbe/watermelondb';
import {field, date, readonly} from '@nozbe/watermelondb/decorators';

export default class Event extends Model {
  static table = 'events';

  @field('remote_id') remoteId;

  @field('interview_id') interviewId;

  @field('participant_id') participantId;

  @field('title') title;

  @field('description') description;

  @date('time') time;

  @field('position') position;

  @readonly @date('created_at') createdAt;

  @readonly @date('updated_at') updatedAt;
}
