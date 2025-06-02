import { PrismaClient } from '@prisma/client';
import { IUserRequest, RequestStatus } from '../models/UserRequest';
const prisma = new PrismaClient();

interface CreateUserRequestDTO {
  name: string;
  email: string;
  area: string;
  role: string;
  team: string;
}

interface GetAllUserRequestsOptions {
  team: string;
}

interface UpdateUserRequestStatusDTO {
  id: string;
  status: 'approved' | 'rejected';
}

export class UserRequestsService {
  public static async createUserRequest(data: CreateUserRequestDTO) : Promise<IUserRequest> {
    try {
      const userRequest = await prisma.userRequest.create({
        data: {
          name: data.name,
          email: data.email,
          area: data.area,
          role: data.role,
          team: data.team,
          status: 'pending' as RequestStatus,
        },
      });
      return userRequest as IUserRequest;
    } catch (error) {
      throw new Error(`Error creating user request: ${error}`);
    }
  }

  public static async getAllUserRequests(options: GetAllUserRequestsOptions): Promise<IUserRequest[]> {
    try {
      const { team } = options;

      const userRequests = await prisma.userRequest.findMany({
        where: {
          team: team
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return userRequests as IUserRequest[];
    } catch (error) {
      throw new Error(`Error fetching user requests: ${error}`);
    }
  }

  public static async updateUserRequestStatus(data: UpdateUserRequestStatusDTO): Promise<IUserRequest> {
    try {

      const result = await prisma.$transaction(async (tx) => {

        const userRequest = await tx.userRequest.update({
          where: {
            id: data.id
          },
          data: {
            status: data.status as RequestStatus
          }
        });
  
        userRequest as IUserRequest;
    
        if (data.status !== "approved") {
          return  { userRequest }
        }
        
        const user = await tx.user.create({
          data: {
            name: userRequest.name,
            email: userRequest.email,
            team: userRequest.team,
            area: userRequest.area,
            role: userRequest.role,
          },
        })
    
        return { userRequest, user }
      })


      return result.userRequest as IUserRequest

    } catch (error) {
      throw new Error(`Error updating user request status: ${error}`);
    }
  }
} 