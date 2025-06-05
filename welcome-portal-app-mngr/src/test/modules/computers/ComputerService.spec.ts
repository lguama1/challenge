import { expect } from 'chai';
import sinon from 'sinon';
import { ComputerService } from '../../../modules/computers/services/ComputerService';
import { PrismaClient } from '@prisma/client';
import { UserService } from '../../../modules/users/services/UserService';
import { IUser } from '../../../modules/users/models/User';
import { IComputer, ComputerAssignmentResult, IComputerAssignment } from '../../../modules/computers/models/IComputer';


describe('ComputerService', () => {
  let prismaMock: any;
  let userServiceMock: sinon.SinonStubbedInstance<UserService>;
  let service: ComputerService;

  beforeEach(() => {
    prismaMock = {
      computer: {
        findMany: sinon.stub(),
      },
      computerAssignment: {
        findMany: sinon.stub(),
      },
    };

    userServiceMock = sinon.createStubInstance(UserService);
    service = new ComputerService(prismaMock as unknown as PrismaClient, userServiceMock);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getAllComputers', () => {
    it('should return all computers ordered by createdAt desc', async () => {
      const mockComputers: IComputer[] = [
        { id: '1', serialNumber: 'ABC123', operatingSystem: 'Windows', createdAt: new Date() },
        { id: '2', serialNumber: 'XYZ456', operatingSystem: 'Linux', createdAt: new Date() },
      ];

      prismaMock.computer.findMany.resolves(mockComputers);

      const result = await service.getAllComputers();

      expect(result).to.deep.equal(mockComputers);
      expect(prismaMock.computer.findMany.calledOnceWith({
        orderBy: { createdAt: 'desc' }
      })).to.be.true;
    });
  });

  describe('getAllComputersForTeam', () => {
    it('should return computer assignments for a given team', async () => {
      const options = { team: 'DevTeam' };

      const mockUsers: IUser[] = [
        { id: 'u1', email: 'alice@example.com', name: 'Alice', area: '', role: '', team: 'DevTeam', createdAt: new Date() },
        { id: 'u2', email: 'bob@example.com', name: 'Bob', area: '', role: '', team: 'DevTeam', createdAt: new Date() },
      ];

      const mockAssignments: IComputerAssignment[] = [
        { id: 'a1', userId: 'u1', computerId: 'c1', deliveredAt: new Date('2023-01-01') },
        { id: 'a2', userId: 'u2', computerId: 'c2', deliveredAt: new Date('2023-02-01') },
      ];

      const mockComputers: IComputer[] = [
        { id: 'c1', serialNumber: 'SN001', operatingSystem: 'macOS', createdAt: new Date() },
        { id: 'c2', serialNumber: 'SN002', operatingSystem: 'Windows', createdAt: new Date() },
      ];

      userServiceMock.getAllUsers.resolves(mockUsers);
      prismaMock.computerAssignment.findMany.resolves(mockAssignments);
      prismaMock.computer.findMany.resolves(mockComputers);

      const result = await service.getAllComputersForTeam(options);

      const expected: ComputerAssignmentResult[] = [
        {
          owner: 'alice@example.com',
          deliveryDate: new Date('2023-01-01'),
          serialNumber: 'SN001',
          system: 'macOS'
        },
        {
          owner: 'bob@example.com',
          deliveryDate: new Date('2023-02-01'),
          serialNumber: 'SN002',
          system: 'Windows'
        },
      ];

      expect(result).to.deep.equal(expected);
      expect(userServiceMock.getAllUsers.calledWith({ team: 'DevTeam' })).to.be.true;
      expect(prismaMock.computerAssignment.findMany.called).to.be.true;
      expect(prismaMock.computer.findMany.called).to.be.true;
    });

    it('should handle users without computer assignments gracefully', async () => {
      const options = { team: 'QA' };

      const mockUsers: IUser[] = [
        { id: 'u3', email: 'charlie@example.com', name: 'Charlie', area: '', role: '', team: 'QA', createdAt: new Date() }
      ];

      userServiceMock.getAllUsers.resolves(mockUsers);
      prismaMock.computerAssignment.findMany.resolves([]);
      prismaMock.computer.findMany.resolves([]);

      const result = await service.getAllComputersForTeam(options);

      expect(result).to.deep.equal([]);
    });
  });
});
