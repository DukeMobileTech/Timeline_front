import {Model, Q} from '@nozbe/watermelondb';
import {field, date, readonly, lazy} from '@nozbe/watermelondb/decorators';

export default class Participant extends Model {
  static table = 'participants';

  @field('remote_id') remoteId;

  @field('new_id') newId;

  @field('participant_type') participantType;

  @field('site') site;

  @readonly @date('created_at') createdAt;

  @readonly @date('updated_at') updatedAt;

  @lazy interviews = this.collections
    .get('interviews')
    .query(Q.where('participant_id', this.remoteId));

  @lazy events = this.collections.get('events').query(Q.where('participant_id', this.remoteId));
}
