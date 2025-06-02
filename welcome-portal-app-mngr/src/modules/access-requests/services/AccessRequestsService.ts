import { PrismaClient } from '@prisma/client';
import { IAccessRequest, IAccessRequestResponse } from '../models/IAccessRequest';
import { RequestStatus } from '../../access-requests/models/IAccessRequest';
import { UserService } from '../../users/services/UserService';
import { IUser } from '../../users/models/User';

const prisma = new PrismaClient();

interface CreateAccessRequestDTO {
  email: string;
  requestedAccess: string[];
}

interface GetAllAccessRequestsOptions {
  team: string;
}

interface UpdateAccessRequestStatusDTO {
  id: string;
  status: RequestStatus.APPROVED | RequestStatus.REJECTED;
}

export class AccessRequestsService {
  public static async createAccessRequest(data: CreateAccessRequestDTO): Promise<IAccessRequest> {
    try {
      const user = await UserService.getUserByEmail(data.email);
      if (!user) {
        throw new Error(`user not found`);
      }

      const accessRequest = await prisma.accessRequest.create({
        data: {
          userId: user.id,
          requestedAccess: data.requestedAccess.join(','),
          status: RequestStatus.PENDING,
          team: user.team
        },
      });

      return {
        ...accessRequest,
        requestedAccess: accessRequest.requestedAccess.split(','),
        status: accessRequest.status as RequestStatus
      };
    } catch (error) {
      throw new Error(`Error creating access request: ${error}`);
    }
  }

  public static async getAllAccessRequests(options: GetAllAccessRequestsOptions): Promise<IAccessRequestResponse[]> {
    try {
      const { team } = options;
      
      const users = await UserService.getAllUsers({ team });

      const usersMap = users.reduce<Record<string, IUser>>((acc, user) => {
        acc[user.id] = user
        return acc
      }, {})


      const accessRequests = await prisma.accessRequest.findMany({
        where: {
          team: team
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return accessRequests.map(request => ({
        email: usersMap[request.userId].email,
        ...request,
        requestedAccess: request.requestedAccess.split(','),
        status: request.status as RequestStatus
      }));
    } catch (error) {
      throw new Error(`Error fetching access requests: ${error}`);
    }
  }

  public static async updateAccessRequestStatus(data: UpdateAccessRequestStatusDTO): Promise<IAccessRequest> {
    try {
      const accessRequest = await prisma.accessRequest.update({
        where: {
          id: data.id
        },
        data: {
          status: data.status
        }
      });

  
      return {
        ...accessRequest,
        requestedAccess: accessRequest.requestedAccess.split(','),
        status: accessRequest.status as RequestStatus
      };
    } catch (error) {
      throw new Error(`Error updating access request status: ${error}`);
    }
  }
} 