import mongoose, { Document, Schema } from 'mongoose';

// Define interface for Attachment document
interface AttachmentDoc extends Document {
    type: 'image' | 'video';
    url: string;
}

// Define schema for Attachments collection
const attachmentSchema = new Schema<AttachmentDoc>({
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true }
});

// Create model for Attachment schema
const Attachment = mongoose.model<AttachmentDoc>('Attachment', attachmentSchema);

// Export Attachment model
export default Attachment;
