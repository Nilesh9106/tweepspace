import mongoose, { Document, Schema } from 'mongoose';
import './user';
import './attachment';
import './hashtag';

// Define interface for Tweep document
interface TweepDoc extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  mentions?: mongoose.Types.ObjectId[];
  hashtags?: string[];
  attachments?: mongoose.Types.ObjectId[];
  created_at: Date;
  likes?: mongoose.Types.ObjectId[];
  retweeps?: mongoose.Types.ObjectId[];
  parent_tweep?: mongoose.Types.ObjectId; // If null, it's a tweep; otherwise, it's a reply to a tweep
}

// Define schema for Tweeps collection
const tweepSchema = new Schema<TweepDoc>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  mentions: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  hashtags: [{ type: String }],
  attachments: [{ type: Schema.Types.ObjectId, ref: 'Attachment' }],
  created_at: { type: Date, default: Date.now },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  retweeps: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  parent_tweep: { type: Schema.Types.ObjectId, ref: 'Tweep' } // If null, it's a tweep; otherwise, it's a reply to a tweep
});

// Create model for Tweep schema
const Tweep: mongoose.Model<TweepDoc> =
  mongoose.models.Tweep || mongoose.model<TweepDoc>('Tweep', tweepSchema);
// Export Tweep model
export default Tweep;
