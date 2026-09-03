import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateCooperativeDto } from './create-cooperative.dto';

// federationId cannot be changed after creation
export class UpdateCooperativeDto extends PartialType(
  OmitType(CreateCooperativeDto, ['federationId'] as const),
) {}
