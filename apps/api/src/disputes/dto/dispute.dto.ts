import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum DisputeType {
  RATING = 'RATING',
  PAYMENT = 'PAYMENT',
  SERVICE_QUALITY = 'SERVICE_QUALITY',
}

export class CreateDisputeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  jobId!: string;

  @ApiProperty({ enum: DisputeType })
  @IsEnum(DisputeType)
  type!: DisputeType;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description!: string;
}

export class ResolveDisputeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  resolution!: string;
}
