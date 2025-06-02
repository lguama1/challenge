import { PrismaClient } from '@prisma/client';
import { IUser } from '../models/User';

const prisma = new PrismaClient();

interface GetAllUsersOptions {
  team: string;
}

export class UserService {
  public static async getAllUsers(options: GetAllUsersOptions): Promise<IUser[]> {
    try {
      const { team } = options;
      
      const users = await prisma.user.findMany({
        where: {
          team: team
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return users;
    } catch (error) {
      throw new Error(`Error fetching users: ${error}`);
    }
  }

  public static async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email
        }
      });
      
      return user;
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error}`);
    }
  }
} 