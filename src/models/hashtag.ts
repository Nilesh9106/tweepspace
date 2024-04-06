import mongoose, { Document, Schema } from 'mongoose';
import './tweep';

// Define interface for Hashtag document
interface HashtagDoc extends Document {
  hashtag: string;
  tweeps: mongoose.Types.ObjectId[]; // References to tweeps that have used the hashtag
}

// Define schema for Hashtags collection
const hashtagSchema = new Schema<HashtagDoc>({
  hashtag: { type: String, unique: true, required: true },
  tweeps: [{ type: Schema.Types.ObjectId, ref: 'Tweep' }] // Array of references to tweeps
});

// Create model for Hashtag schema
const Hashtag: mongoose.Model<HashtagDoc> =
  mongoose.models.Hashtag || mongoose.model<HashtagDoc>('Hashtag', hashtagSchema);

// Export Hashtag model
export default Hashtag;
