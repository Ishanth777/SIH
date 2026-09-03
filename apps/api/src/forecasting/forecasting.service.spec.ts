import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { ForecastingService } from './forecasting.service';
import { PrismaService } from '../common/prisma';

describe('ForecastingService (Rule A3)', () => {
  let service: ForecastingService;
  let mockHttpService: { post: jest.Mock };
  let mockPrismaService: { cooperativeSociety: { findUnique: jest.Mock } };
  let mockConfigService: { get: jest.Mock };

  const mockCoopId = '11111111-2222-3333-4444-555555555555';

  beforeEach(async () => {
    mockHttpService = {
      post: jest.fn(),
    };

    mockPrismaService = {
      cooperativeSociety: {
        findUnique: jest.fn(),
      },
    };

    mockConfigService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'FORECASTING_SERVICE_URL') return 'http://localhost:8000';
        return undefined;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForecastingService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<ForecastingService>(ForecastingService);
  });

  it('should throw 404 if cooperative society does not exist', async () => {
    mockPrismaService.cooperativeSociety.findUnique.mockResolvedValueOnce(null);

    await expect(service.getForecastForCooperative(mockCoopId, 7)).rejects.toThrow(
      new HttpException('Cooperative not found', HttpStatus.NOT_FOUND),
    );
  });

  it('should return live microservice forecast when Python service is healthy', async () => {
    mockPrismaService.cooperativeSociety.findUnique.mockResolvedValueOnce({
      id: mockCoopId,
      name: 'Sample Cooperative',
    });

    const mockApiResponse = [
      {
        date: '2026-09-04',
        forecasts: [
          { category: 'ELECTRICIAN', expectedDemand: 28, confidenceScore: 0.92 },
          { category: 'PLUMBER', expectedDemand: 22, confidenceScore: 0.89 },
          { category: 'CLEANER', expectedDemand: 35, confidenceScore: 0.94 },
          { category: 'CAREGIVER', expectedDemand: 19, confidenceScore: 0.91 },
        ],
      },
    ];

    mockHttpService.post.mockReturnValueOnce(of({ data: mockApiResponse }));

    const result = await service.getForecastForCooperative(mockCoopId, 1);

    expect(result).toHaveLength(1);
    expect(result[0]?.isFallback).toBe(false);
    expect(result[0]?.forecasts[0]?.expectedDemand).toBe(28);
  });

  it('should gracefully degrade to deterministic fallback if Python service is down (Rule A3)', async () => {
    mockPrismaService.cooperativeSociety.findUnique.mockResolvedValueOnce({
      id: mockCoopId,
      name: 'Sample Cooperative',
    });

    // Simulate microservice connection failure or ECONNREFUSED
    mockHttpService.post.mockReturnValueOnce(
      throwError(() => new Error('connect ECONNREFUSED 127.0.0.1:8000')),
    );

    const result = await service.getForecastForCooperative(mockCoopId, 3);

    // Rule A3: Platform must continue functioning normally without throwing 503
    expect(result).toHaveLength(3);
    expect(result[0]?.isFallback).toBe(true);
    expect(result[0]?.forecasts.length).toBeGreaterThanOrEqual(4);
    expect(result[0]?.forecasts[0]?.expectedDemand).toBeGreaterThan(0);
  });
});
