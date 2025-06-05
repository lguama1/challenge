import { PrismaClient } from '@prisma/client';
import { GetAllUsersOptions, IUser } from '../models/User';
import { HandleServiceError } from '../../../utils/ErrorHandler';

export class UserService {
  private readonly prismaClient: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prismaClient = prisma;
  }

  async getAllUsers(options: GetAllUsersOptions): Promise<IUser[]> {
    try {
      const { team } = options;
      
      const users = await this.prismaClient.user.findMany({
        where: {
          team: team
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return users;
    } catch (error) {
      console.error('Error in getAllUsers', error);
      throw HandleServiceError(error)
    }
  }

  async getUserByEmail(email: string): Promise<IUser> {
    try {
      const user = await this.prismaClient.user.findUnique({
        where: {
          email: email
        }
      });

      if (!user) {
        throw new Error("user not found")
      }
      
      return user;
    } catch (error) {
      console.error('Error in getUserByEmail', error);
      throw HandleServiceError(error)
    }
  }
} 