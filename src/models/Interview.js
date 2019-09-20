import {Model} from '@nozbe/watermelondb';
import {field, date, readonly} from '@nozbe/watermelondb/decorators';

export default class Interview extends Model {
  static table = 'interviews';

  @field('remote_id') remoteId;

  @field('participant_id') participantId;

  @field('round') round;

  @date('interview_date') interviewDate;

  @field('age') age;

  @field('grade') grade;

  @field('in_site_since') inSiteSince;

  @field('current_residence_type') currentResidenceType;

  @readonly @date('created_at') createdAt;

  @readonly @date('updated_at') updatedAt;
}
