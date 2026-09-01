import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateServiceCatalogDto } from './create-service-catalog.dto';

export class UpdateServiceCatalogDto extends PartialType(
  OmitType(CreateServiceCatalogDto, ['category'] as const),
) {}
