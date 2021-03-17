import { Types } from 'mongoose';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  isEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IIdentity } from './auth.schema';

const EmptyTransform = () =>
  Transform(value =>
    isEmpty(value) || (Array.isArray(value) && value.length === 0)
      ? undefined
      : value,
  );

export class CreateIdentityArgs
  implements Omit<IIdentity, '_createdAt' | '_updatedAt'> {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class UpdateIdentityArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class GetIdentityFilter {
  @EmptyTransform()
  @Transform(value => {
    if (!value || !/\S/.test(value)) return undefined;
    else return new Types.ObjectId(value);
  })
  userId?: Types.ObjectId;

  @IsOptional()
  @IsString()
  email?: string;
}

export class GetIdentityArgs {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => GetIdentityFilter)
  filters: GetIdentityFilter;
}

export class DeleteIdentityArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}

export class LoginArgs {
  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
