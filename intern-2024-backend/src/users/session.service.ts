import { Injectable, UnauthorizedException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { UserSessions } from './entities/user_sessions.entity';
import { USER_STATUS } from 'src/helpers/user_lifecycle';

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

  async validateUserSession(userId: string, sessionId: string): Promise<void> {
    await this.dbTransactionWrap(async (manager: EntityManager) => {
      const session: UserSessions = await manager
        .createQueryBuilder(UserSessions, 'user_sessions')
        .innerJoin('user_sessions.user', 'user')
        .andWhere('user_sessions.expiry >= :now', {
          now: new Date(),
        })
        .andWhere('user_sessions.id = :sessionId', {
          sessionId,
        })
        .andWhere('user.id = :userId', {
          userId,
        })
        .andWhere('user.status = :status', { status: USER_STATUS.ACTIVE })
        .getOne();

      if (!session) {
        throw new UnauthorizedException();
      }

      // extending expiry asynchronously
      session.expiry = this.getSessionExpiry();
      manager.save(session).catch((err) => console.error('error while extending user session expiry', err));
    });
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
