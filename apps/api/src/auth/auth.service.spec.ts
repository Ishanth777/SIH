import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../common/prisma';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HttpException, UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    otp: {
      updateMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn(),
    signAsync: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key) => {
      if (key === 'JWT_ACCESS_SECRET') return 'access-secret';
      if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
      if (key === 'JWT_ACCESS_EXPIRY') return '15m';
      if (key === 'JWT_REFRESH_EXPIRY') return '7d';
      return null;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendOtp', () => {
    it('should generate an OTP and save it', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: 'user-1', phone: '+919999999999' });
      mockPrismaService.otp.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.otp.create.mockResolvedValue({ id: 'otp-1' });

      const result = await service.sendOtp({ phone: '+919999999999' });

      expect(result).toEqual(expect.objectContaining({ message: 'OTP sent successfully' }));
      expect(mockPrismaService.otp.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: 'user-1',
            code: expect.any(String),
            expiresAt: expect.any(Date),
          }),
        })
      );
    });
  });

  describe('verifyOtp', () => {
    it('should return tokens for valid OTP', async () => {
      const user = {
        id: 'user-1',
        phone: '+919999999999',
        role: 'CUSTOMER',
        cooperativeId: 'coop-1',
      };
      const otp = {
        id: 'otp-1',
        userId: 'user-1',
        code: '123456',
        expiresAt: new Date(Date.now() + 10000), // future
        verified: false,
      };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.otp.findFirst.mockResolvedValue(otp);
      mockPrismaService.otp.update.mockResolvedValue({ ...otp, verified: true });
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.verifyOtp({ phone: '+919999999999', code: '123456' });

      expect(result).toHaveProperty('accessToken', 'token');
      expect(result).toHaveProperty('refreshToken', 'token');
      expect(mockPrismaService.otp.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException for invalid OTP', async () => {
      const user = { id: 'user-1', phone: '+919999999999' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.otp.findFirst.mockResolvedValue(null);

      await expect(service.verifyOtp({ phone: '+919999999999', code: '000000' }))
        .rejects.toThrow(HttpException);
    });

    it('should throw BadRequestException for expired OTP', async () => {
      const user = { id: 'user-1', phone: '+919999999999' };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.otp.findFirst.mockResolvedValue(null);

      await expect(service.verifyOtp({ phone: '+919999999999', code: '123456' }))
        .rejects.toThrow(HttpException);
    });
  });
});
