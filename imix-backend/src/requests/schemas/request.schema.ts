import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RequestDocument = HydratedDocument<Request>;

@Schema({
  collection: 'requests',
  timestamps: true,
})
export class Request {
  @Prop({ required: true, trim: true })
  fullName: string;

  @Prop({ required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, trim: true })
  phone: string;

  @Prop({ required: true, trim: true })
  service: string;

  @Prop({ required: true, trim: true })
  message: string;

  @Prop({ default: 'pending', enum: ['pending', 'in_progress', 'completed'] })
  status: string;
}

export const RequestSchema = SchemaFactory.createForClass(Request);

// Supports default list sorting and future status filtering at scale.
RequestSchema.index({ createdAt: -1, _id: -1 });
RequestSchema.index({ status: 1, createdAt: -1, _id: -1 });
