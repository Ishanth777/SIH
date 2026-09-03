import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RateJobDto {
  @ApiProperty({
    description: 'Rating score from 1 (lowest) to 5 (highest)',
    minimum: 1,
    maximum: 5,
    example: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({
    description: 'Optional review or feedback comment',
    example: 'Worker arrived promptly and performed excellent service.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
