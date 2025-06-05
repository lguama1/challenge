import { PrismaClient } from '@prisma/client';
import { IUser } from '../../users/models/User';
import { UserService } from '../../users/services/UserService';
import { ComputerAssignmentResult, GetAllComputerUsersOptions, IComputer } from '../models/IComputer';
import { HandleServiceError } from '../../../utils/ErrorHandler';

export class ComputerService {
    private readonly prismaClient: PrismaClient;
  private readonly userService: UserService;

  constructor(
    prisma: PrismaClient,
    userService: UserService
  ) {
    this.prismaClient = prisma;
    this.userService = userService;
  }

  async getAllComputers() {
    try {
      const computers = await this.prismaClient.computer.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return computers;
    } catch (error) {
     console.error('Error in getAllComputers', error);
    throw HandleServiceError(error);
    }
  }

 async getAllComputersForTeam(options: GetAllComputerUsersOptions): Promise<ComputerAssignmentResult[]> {
    try {
      const { team } = options;
      const users = await this.userService.getAllUsers({ team });
      const userIds = users.map(user => user.id);
      const usersMap = users.reduce<Record<string, IUser>>((acc, user) => {
        acc[user.id] = user
        return acc
      },{});

      const assignments = await this.prismaClient.computerAssignment.findMany({
        where: {
          userId: {
            in: userIds
          }
        },
      });

      const computerIds = assignments.map(assignment => assignment.computerId);
      const computers = await this.prismaClient.computer.findMany({
        where: {
          id: {
              in: computerIds
          }
        }
      });

      const computersMap = computers.reduce<Record<string, IComputer>>((acc, computer) => {
        acc[computer.id] = computer
        return acc
      },{});

      const results = assignments.map(assignment => ({
        owner: usersMap[assignment.userId].email,
        deliveryDate: assignment.deliveredAt,
        serialNumber: computersMap[assignment.computerId].serialNumber,
        system: computersMap[assignment.computerId].operatingSystem,
      }));

      return results;
    } catch (error) {
      console.error('Error in getAllComputersForTeam', error);
      throw HandleServiceError(error);
    }
  }
} 