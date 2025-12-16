import mongoose from 'mongoose';

export interface IEmailConfig {
  gmailUser: string;
  gmailAppPassword: string;
  updatedAt: Date;
}

const EmailConfigSchema = new mongoose.Schema<IEmailConfig>({
  gmailUser: {
    type: String,
    required: true,
  },
  gmailAppPassword: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.EmailConfig || mongoose.model<IEmailConfig>('EmailConfig', EmailConfigSchema);
