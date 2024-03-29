import mongoose, { Document, Schema } from 'mongoose';

// Define interface for User document
interface UserDoc extends Document {
    username: string;
    email: string;
    password: string;
    name?: string;
    bio?: string;
    profile_picture?: string;
    created_at: Date;
    account_type: 'public' | 'private';
    followers?: mongoose.Types.ObjectId[]; // Followers array (includes both public and private followers)
    follow_requests?: mongoose.Types.ObjectId[];
    following?: mongoose.Types.ObjectId[];
}

// Define schema for Users collection
const userSchema = new Schema<UserDoc>({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: String,
    bio: String,
    profile_picture: String,
    created_at: { type: Date, default: Date.now },
    account_type: { type: String, enum: ['public', 'private'], default: 'public' },
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Single followers array
    follow_requests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
});

// Create model for User schema
const User = mongoose.model<UserDoc>('User', userSchema);

// Export User model
export default User;
