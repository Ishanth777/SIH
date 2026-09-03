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
    it('should generate an OTP and save it for new user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue({ id: 'user-1', phone: '+919999999999', isActive: true });
      mockPrismaService.otp.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.otp.create.mockResolvedValue({ id: 'otp-1' });

      const result = await service.sendOtp({ phone: '+919999999999' });

      expect(result).toEqual(expect.objectContaining({ message: 'OTP sent successfully' }));
      expect(mockPrismaService.user.create).toHaveBeenCalled();
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

    it('should not create user if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1', phone: '+919999999999', isActive: true });
      mockPrismaService.otp.updateMany.mockResolvedValue({ count: 1 });
      mockPrismaService.otp.create.mockResolvedValue({ id: 'otp-1' });

      const result = await service.sendOtp({ phone: '+919999999999' });

      expect(result).toEqual(expect.objectContaining({ message: 'OTP sent successfully' }));
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should throw if user account is deactivated', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1', phone: '+919999999999', isActive: false });

      await expect(service.sendOtp({ phone: '+919999999999' }))
        .rejects.toThrow(HttpException);
    });
  });

  describe('verifyOtp', () => {
    it('should return tokens for valid OTP', async () => {
      const user = {
        id: 'user-1',
        phone: '+919999999999',
        role: 'CUSTOMER',
        cooperativeId: 'coop-1',
        isActive: true,
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

    it('should throw HttpException for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.verifyOtp({ phone: '+919999999999', code: '123456' }))
        .rejects.toThrow(HttpException);
    });

    it('should throw HttpException for deactivated user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'user-1', phone: '+919999999999', isActive: false });

      await expect(service.verifyOtp({ phone: '+919999999999', code: '123456' }))
        .rejects.toThrow(HttpException);
    });

    it('should throw HttpException with OTP_EXPIRED for expired OTP', async () => {
      const user = { id: 'user-1', phone: '+919999999999', isActive: true };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      // First call (valid OTP) returns null
      // Second call (expired OTP check) returns expired OTP record
      mockPrismaService.otp.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'otp-1', code: '123456', verified: false, expiresAt: new Date(Date.now() - 1000) });

      await expect(service.verifyOtp({ phone: '+919999999999', code: '123456' }))
        .rejects.toThrow(HttpException);
    });

    it('should throw HttpException with INVALID_OTP for completely invalid OTP', async () => {
      const user = { id: 'user-1', phone: '+919999999999', isActive: true };
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockPrismaService.otp.findFirst.mockResolvedValue(null);

      await expect(service.verifyOtp({ phone: '+919999999999', code: '000000' }))
        .rejects.toThrow(HttpException);
    });
  });

  describe('refreshToken', () => {
    it('should return new tokens for valid refresh token', async () => {
      const payload = { sub: 'user-1', phone: '+919999999999', role: 'CUSTOMER' };
      const user = { id: 'user-1', phone: '+919999999999', role: 'CUSTOMER', isActive: true };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findUnique.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('new-token');

      const result = await service.refreshToken({ refreshToken: 'valid-refresh-token' });
      expect(result).toHaveProperty('accessToken', 'new-token');
      expect(result).toHaveProperty('refreshToken', 'new-token');
    });

    it('should throw UnauthorizedException if user is deactivated', async () => {
      const payload = { sub: 'user-1', phone: '+919999999999', role: 'CUSTOMER' };
      const user = { id: 'user-1', phone: '+919999999999', role: 'CUSTOMER', isActive: false };

      mockJwtService.verify.mockReturnValue(payload);
      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(service.refreshToken({ refreshToken: 'valid-refresh-token' }))
        .rejects.toThrow(UnauthorizedException);
    });

    it('should throw HttpException if refresh token is invalid', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('jwt expired');
      });

      await expect(service.refreshToken({ refreshToken: 'invalid-token' }))
        .rejects.toThrow(HttpException);
    });
  });
});
