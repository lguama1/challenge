import { expect } from 'chai';
import sinon from 'sinon';
import { UserRequestsService } from '../../../modules/users/services/UserRequestsService';
import { ComputerRequestsService } from '../../../modules/computers/services/ComputerRequestsService';
import { AccessRequestsService } from '../../../modules/access-requests/services/AccessRequestsService';
import { GetAllHistoryOptions } from '../../../modules/history/models/IHistoryResponse';
import { HistoryService } from '../../../modules/history/services/HistoryService';
import { RequestStatus } from '../../../modules/access-requests/models/IAccessRequest';


describe('HistoryService', () => {
  let accessRequestsServiceStub: sinon.SinonStubbedInstance<AccessRequestsService>;
  let computerRequestsServiceStub: sinon.SinonStubbedInstance<ComputerRequestsService>;
  let userRequestsServiceStub: sinon.SinonStubbedInstance<UserRequestsService>;
  let historyService: HistoryService;

  beforeEach(() => {
    accessRequestsServiceStub = sinon.createStubInstance(AccessRequestsService);
    computerRequestsServiceStub = sinon.createStubInstance(ComputerRequestsService);
    userRequestsServiceStub = sinon.createStubInstance(UserRequestsService);

    historyService = new HistoryService(
      accessRequestsServiceStub,
      computerRequestsServiceStub,
      userRequestsServiceStub
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return all requests combined and sorted by date descending', async () => {
    const baseDate = new Date();

    const accessRequest = {
      id: '1',
      userId: 'u1',
      email: 'access@example.com',
      createdAt: new Date(baseDate.getTime() - 3000),
      status: RequestStatus.APPROVED,
      requestedAccess: ['Admin'],
      team: 'devTeam'
    };

    const computerRequest = {
      id: '2',
      userId: 'u2',
      email: 'computer@example.com',
      createdAt: new Date(baseDate.getTime() - 2000),
      status: RequestStatus.APPROVED,
      requestedSystem: 'Linux',
        team: 'devTeam'
    };

    const userRequest = {
      id: '3',
      email: 'user@example.com',
      createdAt: new Date(baseDate.getTime() - 1000),
      status: RequestStatus.REJECTED,
      name: 'san',
      role: 'developer',
      area: 'Engineering',
      team: 'devTeam'
    };

    accessRequestsServiceStub.getAllAccessRequests.resolves([accessRequest]);
    computerRequestsServiceStub.getAllComputerRequests.resolves([computerRequest]);
    userRequestsServiceStub.getAllUserRequests.resolves([userRequest]);

    const options: GetAllHistoryOptions = { team: 'teamA' };

    const result = await historyService.getAllRequests(options);

    expect(result).to.be.an('array').with.lengthOf(3);
    expect(result[0]).to.include({ typeOfRequest: 'user', id: '3' });
    expect(result[1]).to.include({ typeOfRequest: 'computer', id: '2' });
    expect(result[2]).to.include({ typeOfRequest: 'access', id: '1' });

    expect(result[0].createdAt.getTime()).to.be.greaterThan(result[1].createdAt.getTime());
    expect(result[1].createdAt.getTime()).to.be.greaterThan(result[2].createdAt.getTime());
  });

  it('should throw error if any service throws', async () => {
    accessRequestsServiceStub.getAllAccessRequests.rejects(new Error('DB error'));

    try {
      await historyService.getAllRequests({ team: 'teamB' });
      throw new Error('Should have thrown an error');
    } catch (err: any) {
      expect(err.message).to.include('Error fetching request history');
      expect(err.message).to.include('DB error');
    }
  });
});
