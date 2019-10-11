import {Model, Q} from '@nozbe/watermelondb';
import {field, date, readonly, lazy} from '@nozbe/watermelondb/decorators';

export default class Participant extends Model {
  static table = 'participants';

  @field('remote_id') remoteId;

  @field('identifier') identifier;

  @field('participant_type') participantType;

  @field('site') site;

  @date('discarded_at') discardedAt;

  @readonly @date('created_at') createdAt;

  @readonly @date('updated_at') updatedAt;

  @lazy interviews = this.collections
    .get('interviews')
    .query(Q.where('participant_id', this.remoteId), Q.where('discarded_at', null));

  @lazy events = this.collections
    .get('events')
    .query(Q.where('participant_id', this.remoteId), Q.where('discarded_at', null));
}
