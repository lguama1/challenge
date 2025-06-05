// tests/access-requests/AccessRequestsService.test.ts
import { expect } from 'chai';
import sinon from 'sinon';
import { AccessRequestsService } from '../../../modules/access-requests/services/AccessRequestsService';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../../../modules/users/services/UserService';
import {
  CreateAccessRequestDTO,
  GetAllAccessRequestsOptions,
  RequestStatus,
  UpdateAccessRequestStatusDTO
} from '../../../modules/access-requests/models/IAccessRequest';
import { IUser } from '../../../modules/users/models/User';

describe('AccessRequestsService', () => {
  let prismaMock: any;
  let userServiceMock: sinon.SinonStubbedInstance<UserService>;
  let service: AccessRequestsService;

  beforeEach(() => {
    prismaMock = {
      accessRequest: {
        create: sinon.stub(),
        findMany: sinon.stub(),
        update: sinon.stub(),
      },
    };

    userServiceMock = sinon.createStubInstance(UserService);
    service = new AccessRequestsService(prismaMock as unknown as PrismaClient, userServiceMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should create access request and return formatted result', async () => {
    const dto: CreateAccessRequestDTO = {
      email: 'test@example.com',
      requestedAccess: ['admin', 'editor'],
    };

    const fakeUser: IUser = {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
      area: 'Engineering',
      role: 'Developer',
      team: 'TeamA',
      createdAt: new Date()
    };

    const fakeCreated = {
      id: 'access-req-1',
      userId: fakeUser.id,
      requestedAccess: 'admin,editor',
      team: fakeUser.team,
      status: 'pending',
      createdAt: new Date(),
    };

    userServiceMock.getUserByEmail.resolves(fakeUser);
    prismaMock.accessRequest.create.resolves(fakeCreated);

    const result = await service.createAccessRequest(dto);

    expect(result).to.deep.equal({
      ...fakeCreated,
      requestedAccess: ['admin', 'editor'],
      status: RequestStatus.PENDING,
    });
    expect(userServiceMock.getUserByEmail.calledWith(dto.email)).to.be.true;
    expect(prismaMock.accessRequest.create.calledOnce).to.be.true;
  });

  it('should return all access requests with user emails', async () => {
    const options: GetAllAccessRequestsOptions = { team: 'TeamA' };

    const users: IUser[] = [
      { id: '1', name: 'Alice', email: 'alice@example.com', area: '', role: '', team: 'TeamA',       createdAt: new Date(), },
      { id: '2', name: 'Bob', email: 'bob@example.com', area: '', role: '', team: 'TeamA',       createdAt: new Date(), },
    ];

    const accessRequests = [
      {
        id: 'req1',
        userId: '1',
        requestedAccess: 'admin',
        team: 'TeamA',
        status: 'approved',
        createdAt: new Date(),
      },
      {
        id: 'req2',
        userId: '2',
        requestedAccess: 'viewer,editor',
        team: 'TeamA',
        status: 'pending',
        createdAt: new Date(),
      },
    ];

    userServiceMock.getAllUsers.resolves(users);
    prismaMock.accessRequest.findMany.resolves(accessRequests);

    const result = await service.getAllAccessRequests(options);

    expect(result).to.deep.equal([
      {
        ...accessRequests[0],
        email: 'alice@example.com',
        requestedAccess: ['admin'],
        status: RequestStatus.APPROVED,
      },
      {
        ...accessRequests[1],
        email: 'bob@example.com',
        requestedAccess: ['viewer', 'editor'],
        status: RequestStatus.PENDING,
      },
    ]);
    expect(userServiceMock.getAllUsers.calledWith({ team: 'TeamA' })).to.be.true;
  });

  it('should update status of access request and return result', async () => {
    const dto: UpdateAccessRequestStatusDTO = {
      id: 'req123',
      status: RequestStatus.APPROVED,
    };

    const updated = {
      id: 'req123',
      userId: 'user1',
      requestedAccess: 'admin',
      team: 'TeamA',
      status: 'approved',
      createdAt: new Date(),
    };

    prismaMock.accessRequest.update.resolves(updated);

    const result = await service.updateAccessRequestStatus(dto);

    expect(result).to.deep.equal({
      ...updated,
      requestedAccess: ['admin'],
      status: RequestStatus.APPROVED,
    });
    expect(prismaMock.accessRequest.update.calledOnceWith({
      where: { id: dto.id },
      data: { status: dto.status }
    })).to.be.true;
  });
});
