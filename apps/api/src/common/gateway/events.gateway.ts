/**
 * Socket.IO Gateway with Redis adapter.
 *
 * Per rule A10: Socket.IO uses the Redis adapter from the start,
 * even in development. Required for multi-instance deployments.
 *
 * Events emitted:
 * - job:offer       — new job offer pushed to matched workers
 * - job:status      — job status updates (accepted, in-progress, completed)
 * - booking:status  — live booking status for customers
 */
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import type { EnvConfig } from '../config/env.validation';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/events',
})
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Server type comes from socket.io which is a peer dep of platform-socket.io

  private readonly logger = new Logger(EventsGateway.name);

  constructor(private readonly config: ConfigService<EnvConfig, true>) {}

  async afterInit(server: any): Promise<void> { // eslint-disable-line @typescript-eslint/no-explicit-any
    // Set up Redis adapter (rule A10)
    const redisHost = this.config.get('REDIS_HOST', { infer: true });
    const redisPort = this.config.get('REDIS_PORT', { infer: true });

    const pubClient = new Redis({ host: redisHost, port: redisPort });
    const subClient = pubClient.duplicate();

    server.adapter(createAdapter(pubClient, subClient));

    this.logger.log('Socket.IO initialized with Redis adapter');
  }

  handleConnection(client: { id: string }): void {
    this.logger.debug(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: { id: string }): void {
    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit a job offer to a specific worker's room.
   */
  emitJobOffer(workerId: string, payload: Record<string, unknown>): void {
    this.server.to(`worker:${workerId}`).emit('job:offer', payload);
  }

  /**
   * Emit a job status update to all subscribers of a job.
   */
  emitJobStatus(jobId: string, payload: Record<string, unknown>): void {
    this.server.to(`job:${jobId}`).emit('job:status', payload);
  }

  /**
   * Emit a booking status update to the customer.
   */
  emitBookingStatus(customerId: string, payload: Record<string, unknown>): void {
    this.server.to(`customer:${customerId}`).emit('booking:status', payload);
  }
}
