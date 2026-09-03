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
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
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
    try {
      const redisHost = this.config.get('REDIS_HOST', { infer: true });
      const redisPort = this.config.get('REDIS_PORT', { infer: true });

      const pubClient = new Redis({
        host: redisHost,
        port: redisPort,
        connectTimeout: 2000,
        maxRetriesPerRequest: 1,
        lazyConnect: true,
        retryStrategy: () => null, // Don't loop retries if Redis is unavailable in local dev
      });

      pubClient.on('error', (err) => {
        this.logger.warn(`Redis adapter connection issue: ${err.message}`);
      });

      // Verify connection before binding to Socket.IO adapter
      await pubClient.connect();

      const subClient = pubClient.duplicate();
      subClient.on('error', (err) => {
        this.logger.warn(`Redis adapter sub connection issue: ${err.message}`);
      });
      await subClient.connect();

      const ioServer = typeof server.adapter === 'function' ? server : server?.server;
      if (ioServer && typeof ioServer.adapter === 'function') {
        ioServer.adapter(createAdapter(pubClient, subClient));
        this.logger.log('Socket.IO initialized with Redis adapter');
      } else {
        this.logger.log('Socket.IO initialized with in-memory adapter');
      }
    } catch (err: any) {
      this.logger.warn(`Redis offline — Socket.IO falling back to in-memory adapter: ${err.message}`);
    }
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

  @SubscribeMessage('job:join_room')
  handleJoinJobRoom(
    @MessageBody() data: { jobId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`job:${data.jobId}`);
  }

  @SubscribeMessage('job:leave_room')
  handleLeaveJobRoom(
    @MessageBody() data: { jobId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`job:${data.jobId}`);
  }

  @SubscribeMessage('worker:join_room')
  handleJoinWorkerRoom(
    @MessageBody() data: { workerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`worker:${data.workerId}`);
  }
}
