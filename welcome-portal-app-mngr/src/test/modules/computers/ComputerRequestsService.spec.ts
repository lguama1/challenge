import { expect } from 'chai';
import sinon from 'sinon';
import { PrismaClient } from '@prisma/client';
import { ComputerRequestsService } from '../../../modules/computers/services/ComputerRequestsService';
import { RequestStatus, CreateComputerRequestDTO, UpdateComputerRequestStatusDTO } from '../../../modules/computers/models/IComputerRequest';
import { UserService } from '../../../modules/users/services/UserService';
import { IUser } from '../../../modules/users/models/User';

describe('ComputerRequestsService', () => {
  let prismaMock: any;
  let userServiceMock: sinon.SinonStubbedInstance<UserService>;
  let service: ComputerRequestsService;

  beforeEach(() => {
    prismaMock = {
      computerRequest: {
        create: sinon.stub(),
        findMany: sinon.stub(),
        update: sinon.stub()
      },
      computerAssignment: {
        findMany: sinon.stub(),
        create: sinon.stub()
      },
      computer: {
        findFirst: sinon.stub()
      },
      $transaction: sinon.stub()
    };

    userServiceMock = sinon.createStubInstance(UserService);
    service = new ComputerRequestsService(prismaMock as unknown as PrismaClient, userServiceMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('createComputerRequest', () => {
    it('should create a new computer request', async () => {
      const dto: CreateComputerRequestDTO = {
        email: 'john@example.com',
        requestedSystem: 'Windows'
      };

      const mockUser: IUser = {
        id: 'user-1',
        email: dto.email,
        name: 'John',
        role: '',
        team: 'DevTeam',
        area: '',
        createdAt: new Date()
      };

      const createdRequest = {
        id: 'req-1',
        userId: mockUser.id,
        requestedSystem: dto.requestedSystem,
        team: mockUser.team,
        status: RequestStatus.PENDING,
        createdAt: new Date()
      };

      userServiceMock.getUserByEmail.resolves(mockUser);
      prismaMock.computerRequest.create.resolves(createdRequest);

      const result = await service.createComputerRequest(dto);
      expect(result).to.deep.equal(createdRequest);
    });
  });

  describe('getAllComputerRequests', () => {
    it('should return computer requests with user emails', async () => {
      const team = 'DevTeam';
      const users: IUser[] = [
        { id: 'u1', email: 'a@a.com', name: '', role: '', team, area: '', createdAt: new Date() },
        { id: 'u2', email: 'b@b.com', name: '', role: '', team, area: '', createdAt: new Date() }
      ];

      const requests = [
        {
          id: 'r1',
          userId: 'u1',
          requestedSystem: 'Windows',
          team,
          status: RequestStatus.PENDING,
          createdAt: new Date()
        },
        {
          id: 'r2',
          userId: 'u2',
          requestedSystem: 'Linux',
          team,
          status: RequestStatus.APPROVED,
          createdAt: new Date()
        }
      ];

      userServiceMock.getAllUsers.resolves(users);
      prismaMock.computerRequest.findMany.resolves(requests);

      const result = await service.getAllComputerRequests({ team });

      expect(result).to.deep.equal([
        { ...requests[0], email: 'a@a.com' },
        { ...requests[1], email: 'b@b.com' }
      ]);
    });
  });

  describe('updateComputerRequestStatus', () => {
    it('should update status to approved and assign a computer', async () => {
      const dto: UpdateComputerRequestStatusDTO = {
        id: 'req-1',
        status: RequestStatus.APPROVED
      };

      const request = {
        id: dto.id,
        userId: 'user-1',
        requestedSystem: 'Linux',
        team: 'DevTeam',
        status: dto.status,
        createdAt: new Date()
      };

      const existingAssignments = [
        { computerId: 'c1' },
        { computerId: 'c2' }
      ];

      const availableComputer = {
        id: 'c3',
        operatingSystem: 'Linux',
        serialNumber: 'SN3',
        createdAt: new Date()
      };

      const transactionStub = async (callback: any) => {
        return await callback({
          computerRequest: {
            update: sinon.stub().resolves(request)
          },
          computerAssignment: {
            findMany: sinon.stub().resolves(existingAssignments),
            create: sinon.stub().resolves()
          },
          computer: {
            findFirst: sinon.stub().resolves(availableComputer)
          }
        });
      };

      prismaMock.$transaction.callsFake(transactionStub);

      const result = await service.updateComputerRequestStatus(dto);
      expect(result.id).to.equal(dto.id);
      expect(result.status).to.equal(RequestStatus.APPROVED);
    });

    it('should update status to rejected and not assign a computer', async () => {
      const dto: UpdateComputerRequestStatusDTO = {
        id: 'req-2',
        status: RequestStatus.REJECTED
      };

      const rejectedRequest = {
        id: dto.id,
        userId: 'user-2',
        requestedSystem: 'Windows',
        team: 'QA',
        status: dto.status,
        createdAt: new Date()
      };

      const transactionStub = async (callback: any) => {
        return await callback({
          computerRequest: {
            update: sinon.stub().resolves(rejectedRequest)
          },
          computerAssignment: {
            findMany: sinon.stub()
          },
          computer: {
            findFirst: sinon.stub()
          }
        });
      };

      prismaMock.$transaction.callsFake(transactionStub);

      const result = await service.updateComputerRequestStatus(dto);
      expect(result.status).to.equal(RequestStatus.REJECTED);
    });
  });
});
