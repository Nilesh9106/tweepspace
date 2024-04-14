import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Define interface for User document
interface UserDoc extends Document {
  username: string;
  email: string;
  password: string;
  name?: string;
  bio?: string;
  profile_picture?: string;
  created_at: Date;
  followers?: string[]; // Followers array (includes both public and private followers)
  following?: string[];
  emailToken: string | null;
}

// Define schema for Users collection
const userSchema = new Schema<UserDoc>({
  username: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, trim: true },
  bio: { type: String, trim: true },
  profile_picture: { type: String },
  created_at: { type: Date, default: Date.now },
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Single followers array
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  emailToken: { type: String, trim: true }
});

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Create model for User schema
const User: mongoose.Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>('User', userSchema);

// Export User model
export default User;
