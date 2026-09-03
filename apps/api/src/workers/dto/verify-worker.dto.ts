import { IsEnum, IsOptional, IsArray, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum VerificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export class VerifyWorkerDto {
  @ApiProperty({ description: 'New verification status', enum: VerificationStatus })
  @IsEnum(VerificationStatus)
  verificationStatus!: VerificationStatus;

  @ApiPropertyOptional({
    description: 'KYC document URLs (stored in object storage per rule A6)',
    example: ['https://minio:9000/coop-documents/kyc/aadhaar-front.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  kycDocumentUrls?: string[];
}
