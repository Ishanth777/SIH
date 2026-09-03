import { Test, TestingModule } from '@nestjs/testing';
import { MatchingService } from './matching.service';
import { PrismaService } from '../common/prisma';
import { EventsGateway } from '../common/gateway';

describe('MatchingService', () => {
  let service: MatchingService;
  let prisma: PrismaService;
  let eventsGateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchingService,
        {
          provide: PrismaService,
          useValue: {
            serviceRequest: { findUnique: jest.fn() },
            job: { create: jest.fn() },
            $queryRaw: jest.fn(),
          },
        },
        {
          provide: EventsGateway,
          useValue: {
            emitJobOffer: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MatchingService>(MatchingService);
    prisma = module.get<PrismaService>(PrismaService);
    eventsGateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
