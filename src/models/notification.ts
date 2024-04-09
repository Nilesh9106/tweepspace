import { Model, models } from 'mongoose';
import { Schema, Document, model, Types } from 'mongoose';

interface NotificationDoc extends Document {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  type: 'mention' | 'comment' | 'retweet' | 'follow';
  tweep?: Types.ObjectId;
  read: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<NotificationDoc>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: {
    type: String,
    enum: ['mention', 'comment', 'retweet', 'follow'],
    required: true
  },
  tweep: { type: Schema.Types.ObjectId, ref: 'Tweep' },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notifications: Model<NotificationDoc> =
  models.Notification || model<NotificationDoc>('Notification', notificationSchema);

export default Notifications;
