/**
 * Customers Service — registration and address book management.
 */
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../common/prisma';
import { ErrorCode } from '../common/constants';
import { RegisterCustomerDto, UpdateCustomerDto, AddAddressDto } from './dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterCustomerDto) {
    const existing = await this.prisma.customer.findUnique({
      where: { userId: dto.userId },
    });

    if (existing) {
      throw new ConflictException({
        message: 'Customer profile already exists for this user',
        errorCode: 'CUSTOMER_ALREADY_EXISTS',
      });
    }

    // Update user role
    await this.prisma.user.update({
      where: { id: dto.userId },
      data: { role: 'CUSTOMER', cooperativeId: dto.cooperativeId },
    });

    return this.prisma.customer.create({
      data: {
        userId: dto.userId,
        cooperativeId: dto.cooperativeId,
        name: dto.name,
        email: dto.email,
      },
      include: {
        user: { select: { id: true, phone: true } },
        cooperative: { select: { id: true, name: true } },
      },
    });
  }

  async findAll(cooperativeId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const where = { cooperativeId };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { phone: true } },
          _count: { select: { addresses: true, serviceRequests: true } },
        },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, phone: true } },
        cooperative: { select: { id: true, name: true } },
        addresses: true,
      },
    });

    if (!customer) {
      throw new NotFoundException({
        message: 'Customer not found',
        errorCode: ErrorCode.CUSTOMER_NOT_FOUND,
      });
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    await this.findOne(id);
    return this.prisma.customer.update({ where: { id }, data: dto });
  }

  async addAddress(customerId: string, dto: AddAddressDto) {
    await this.findOne(customerId);

    // If this is the default address, unset other defaults
    if (dto.isDefault) {
      await this.prisma.customerAddress.updateMany({
        where: { customerId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return this.prisma.customerAddress.create({
      data: { customerId, ...dto },
    });
  }

  async removeAddress(customerId: string, addressId: string) {
    await this.findOne(customerId);
    return this.prisma.customerAddress.delete({ where: { id: addressId } });
  }
}
