import { Document, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface IIdentity {
  userId: Types.ObjectId;
  email: string;
  password: string;
  _createdAt: Date;
  _updatedAt: Date;
}

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  },
})
export class Identity extends Document implements IIdentity {
  _createdAt: Date;
  _updatedAt: Date;

  @Prop({ type: Types.ObjectId, unique: true, required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String, unique: true, required: true })
  password: string;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);
