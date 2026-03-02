import mongoose, { Schema, Document, model } from 'mongoose';

export interface IOTP {
  email: string;
  otp: string;
  createdAt: Date;
}

export interface OTPDocument extends IOTP, Document {}

const otpSchema = new Schema<OTPDocument>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // TTL 5 minutes
  },
});

export const OTP = model<OTPDocument>('OTP', otpSchema);
