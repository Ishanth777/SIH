import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum WorkerJobAction {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  START = 'START',
  COMPLETE = 'COMPLETE',
}

export class UpdateJobStatusDto {
  @ApiProperty({ enum: WorkerJobAction })
  @IsEnum(WorkerJobAction)
  @IsNotEmpty()
  action!: WorkerJobAction;
}
