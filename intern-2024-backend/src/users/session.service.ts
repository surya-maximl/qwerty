import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserSessions } from './entities/user_sessions.entity';

@Injectable()
export class SessionService {
  constructor(private readonly entityManager: EntityManager) {}

  async createSession(userId: string, device: string, manager?: EntityManager) {
    return await this.dbTransactionWrap(async (manager: EntityManager) => {
      return await manager.save(
        manager.create(UserSessions, {
          userId,
          device,
          createdAt: new Date(),
          expiry: this.getSessionExpiry(),
        }),
      );
    }, manager);
  }

  private getSessionExpiry(): Date {
    // default expiry 10 days (14400 minutes)
    const now = new Date();
    return new Date(now.getTime() + 14400 * 60000);
  }

  async dbTransactionWrap(
    operation: (...args) => any,
    manager?: EntityManager,
  ): Promise<any> {
    if (manager) {
      return await operation(manager);
    } else {
      return await this.entityManager.transaction(async (manager) => {
        return await operation(manager);
      });
    }
  }
}
