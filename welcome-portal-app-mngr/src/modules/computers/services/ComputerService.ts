import { PrismaClient } from '@prisma/client';
import { IUser } from '../../users/models/User';
import { UserService } from '../../users/services/UserService';
import { IComputer } from '../models/IComputer';

const prisma = new PrismaClient();

interface GetAllComputerUsersOptions {
    team: string;
  }
  
interface ComputerAssignmentResult {
  owner: string;
  serialNumber: string;
  system: string;
  deliveryDate: Date | null;
}

export class ComputerService {
  public static async getAllComputers() {
    try {
      const computers = await prisma.computer.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      return computers;
    } catch (error) {
      throw new Error(`Error fetching computers: ${error}`);
    }
  }

 public static async getAllComputersForTeam(options: GetAllComputerUsersOptions): Promise<ComputerAssignmentResult[]> {
    try {
      const { team } = options;

      const users = await UserService.getAllUsers({ team });

      const userIds = users.map(user => user.id);
      
      const usersMap = users.reduce<Record<string, IUser>>((acc, user) => {
        acc[user.id] = user
        return acc
      }, {})

      const assignments = await prisma.computerAssignment.findMany({
        where: {
          userId: {
            in: userIds
          }
        },
      });

      const computerIds = assignments.map(assignment => assignment.computerId);

      const computers = await prisma.computer.findMany({
        where: {
            id: {
                in: computerIds
            }
        }
      });

      const computersMap = computers.reduce<Record<string, IComputer>>((acc, computer) => {
        acc[computer.id] = computer
        return acc
      }, {})

         const results = assignments.map(assignment => ({
        owner: usersMap[assignment.userId].email,
        deliveryDate: assignment.deliveredAt,
        serialNumber: computersMap[assignment.computerId].serialNumber,
        system: computersMap[assignment.computerId].operatingSystem,
      }));

      return results;
    } catch (error) {
      throw new Error(`Error fetching computers for team: ${error}`);
    }
  }
} 