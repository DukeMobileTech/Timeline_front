import {Model} from '@nozbe/watermelondb';
import {field, date, readonly} from '@nozbe/watermelondb/decorators';
import {INTERVIEWS} from '../helpers/Constants';

export default class Interview extends Model {
  static table = INTERVIEWS;

  @field('remote_id') remoteId;

  @field('identifier') identifier;

  @field('participant_identifier') participantIdentifier;

  @field('round') round;

  @date('interview_date') interviewDate;

  @field('age') age;

  @field('grade') grade;

  @date('discarded_at') discardedAt;

  @readonly @date('created_at') createdAt;

  @readonly @date('updated_at') updatedAt;
}
