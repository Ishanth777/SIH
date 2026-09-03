import { Test, TestingModule } from '@nestjs/testing';
import { RequestsService } from './requests.service';
import { PrismaService } from '../common/prisma';
import { getQueueToken } from '@nestjs/bullmq';
import { MATCHING_QUEUE } from '../common/queue';

describe('RequestsService', () => {
  let service: RequestsService;
  let prisma: PrismaService;
  let matchingQueue: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RequestsService,
        {
          provide: PrismaService,
          useValue: {
            serviceCatalog: { findUnique: jest.fn() },
            customer: { findUnique: jest.fn() },
            serviceRequest: { create: jest.fn(), findMany: jest.fn(), findUnique: jest.fn(), count: jest.fn() },
          },
        },
        {
          provide: getQueueToken(MATCHING_QUEUE),
          useValue: {
            add: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RequestsService>(RequestsService);
    prisma = module.get<PrismaService>(PrismaService);
    matchingQueue = module.get(getQueueToken(MATCHING_QUEUE));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
