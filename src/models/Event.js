import {Model} from '@nozbe/watermelondb';
import {field, date, readonly} from '@nozbe/watermelondb/decorators';
import {EVENTS} from '../helpers/Constants';

export default class Event extends Model {
  static table = EVENTS;

  @field('remote_id') remoteId;

  @field('uuid') uuid;

  @field('interview_identifier') interviewIdentifier;

  @field('participant_identifier') participantIdentifier;

  @field('title') title;

  @field('description') description;

  @date('time') time;

  @date('discarded_at') discardedAt;

  @readonly @date('created_at') createdAt;

  @readonly @date('updated_at') updatedAt;
}
