import { expect } from 'chai';
import sinon from 'sinon';
import { UserRequestsService } from '../../../modules/users/services/UserRequestsService';
import { CreateUserRequestDTO, UpdateUserRequestStatusDTO } from '../../../modules/users/models/UserRequest';

describe('UserRequestsService', () => {
  let prismaMock: any;
  let service: UserRequestsService;

  beforeEach(() => {
    prismaMock = {
      userRequest: {
        create: sinon.stub(),
        findMany: sinon.stub(),
        update: sinon.stub(),
      },
      user: {
        create: sinon.stub()
      },
      $transaction: sinon.stub()
    };

    service = new UserRequestsService(prismaMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createUserRequest', () => {
    it('debería crear una solicitud de usuario', async () => {
      const dto: CreateUserRequestDTO = {
        name: 'John',
        email: 'john@example.com',
        area: 'IT',
        role: 'Dev',
        team: 'Team A'
      };

      const mockResponse = {
        id: '1',
        ...dto,
        status: 'pending',
        createdAt: new Date()
      };

      prismaMock.userRequest.create.resolves(mockResponse);

      const result = await service.createUserRequest(dto);

      expect(prismaMock.userRequest.create.calledOnce).to.be.true;
      expect(result).to.deep.equal(mockResponse);
    });
  });

  describe('getAllUserRequests', () => {
    it('debería retornar las solicitudes de usuario por equipo', async () => {
      const mockRequests = [
        {
          id: '1',
          name: 'Alice',
          email: 'alice@example.com',
          area: 'IT',
          role: 'QA',
          team: 'Team B',
          status: 'pending',
          createdAt: new Date()
        }
      ];

      prismaMock.userRequest.findMany.resolves(mockRequests);

      const result = await service.getAllUserRequests({ team: 'Team B' });

      expect(prismaMock.userRequest.findMany.calledOnce).to.be.true;
      expect(result).to.deep.equal(mockRequests);
    });
  });

  describe('updateUserRequestStatus', () => {
    it('debería actualizar el estado y crear usuario si es aprobado', async () => {
      const dto: UpdateUserRequestStatusDTO = {
        id: '1',
        status: 'approved'
      };

      const userRequest = {
        id: '1',
        name: 'Carlos',
        email: 'carlos@example.com',
        area: 'Ops',
        role: 'Manager',
        team: 'Team X',
        status: 'approved',
        createdAt: new Date()
      };

      const user = {
        id: '2',
        name: 'Carlos',
        email: 'carlos@example.com',
        area: 'Ops',
        role: 'Manager',
        team: 'Team X',
        createdAt: new Date()
      };

      prismaMock.$transaction.callsFake(async (fn: any) => {
        return fn({
          userRequest: {
            update: sinon.stub().resolves(userRequest)
          },
          user: {
            create: sinon.stub().resolves(user)
          }
        });
      });

      const result = await service.updateUserRequestStatus(dto);

      expect(result).to.deep.equal(userRequest);
    });

    it('debería actualizar el estado y NO crear usuario si es rechazado', async () => {
      const dto: UpdateUserRequestStatusDTO = {
        id: '1',
        status: 'rejected'
      };

      const userRequest = {
        id: '1',
        name: 'Carlos',
        email: 'carlos@example.com',
        area: 'Ops',
        role: 'Manager',
        team: 'Team X',
        status: 'rejected',
        createdAt: new Date()
      };

      prismaMock.$transaction.callsFake(async (fn: any) => {
        return fn({
          userRequest: {
            update: sinon.stub().resolves(userRequest)
          },
          user: {
            create: sinon.stub().throws('No debería llamarse')
          }
        });
      });

      const result = await service.updateUserRequestStatus(dto);

      expect(result).to.deep.equal(userRequest);
    });
  });
});
