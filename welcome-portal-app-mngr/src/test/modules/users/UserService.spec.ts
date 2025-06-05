import { expect } from 'chai';
import sinon from 'sinon';
import { UserService } from '../../../modules/users/services/UserService';
import { PrismaClient } from '@prisma/client';

describe('UserService', () => {
  let prismaMock: Partial<PrismaClient>;
  let userService: UserService;

  beforeEach(() => {
    prismaMock = {
      user: {
        findMany: sinon.stub(),
        findUnique: sinon.stub()
      }
    } as any;
    userService = new UserService(prismaMock as PrismaClient);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllUsers', () => {
    it('debería retornar una lista de usuarios', async () => {
      const mockUsers = [
        {
          id: '1',
          name: 'Juan',
          email: 'juan@example.com',
          team: 'A',
          area: 'IT',
          role: 'Dev',
          createdAt: new Date()
        }
      ];

      (prismaMock.user?.findMany as sinon.SinonStub).resolves(mockUsers);

      const result = await userService.getAllUsers({ team: 'A' });

      expect(result).to.deep.equal(mockUsers);
    });
  });

  describe('getUserByEmail', () => {
    it('debería retornar un usuario por email', async () => {
      const mockUser = {
        id: '1',
        name: 'Juan',
        email: 'juan@example.com',
        team: 'A',
        area: 'IT',
        role: 'Dev',
        createdAt: new Date()
      };

      (prismaMock.user?.findUnique as sinon.SinonStub).resolves(mockUser);

      const result = await userService.getUserByEmail('juan@example.com');

      expect(result).to.deep.equal(mockUser);
    });

    it('debería lanzar error si no encuentra usuario', async () => {
      (prismaMock.user?.findUnique as sinon.SinonStub).resolves(null);

      try {
        await userService.getUserByEmail('noexiste@example.com');
        throw new Error('La función no lanzó un error como se esperaba');
      } catch (error: any) {
        expect(error.message).to.equal('Error inesperado.');
      }
    });
  });
});
