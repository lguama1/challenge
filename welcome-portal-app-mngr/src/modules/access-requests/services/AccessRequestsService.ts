import { PrismaClient } from '@prisma/client';
import {
  CreateAccessRequestDTO,
  GetAllAccessRequestsOptions,
  IAccessRequest,
  IAccessRequestResponse,
  UpdateAccessRequestStatusDTO } from '../models/IAccessRequest';
import { RequestStatus } from '../../access-requests/models/IAccessRequest';
import { UserService } from '../../users/services/UserService';
import { IUser } from '../../users/models/User';
import { HandleServiceError } from '../../../utils/ErrorHandler';

export class AccessRequestsService {
  private readonly prismaClient: PrismaClient;
  private readonly userService: UserService;

  constructor(
    prisma: PrismaClient,
    userService: UserService
  ) {
    this.prismaClient = prisma;
    this.userService = userService;
  }

  async createAccessRequest(data: CreateAccessRequestDTO): Promise<IAccessRequest> {
    try {
      const user = await this.userService.getUserByEmail(data.email);
      const accessRequest = await this.prismaClient.accessRequest.create({
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
      console.error('Error in createAccessRequest', error);
      throw HandleServiceError(error);
    }
  }

  async getAllAccessRequests(options: GetAllAccessRequestsOptions): Promise<IAccessRequestResponse[]> {
    try {
      const { team } = options;
      const users = await this.userService.getAllUsers({ team });
      const usersMap = users.reduce<Record<string, IUser>>((acc, user) => {
        acc[user.id] = user
        return acc
      }, {});

      const accessRequests = await this.prismaClient.accessRequest.findMany({
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
      console.error('Error in getAllAccessRequests', error);
      throw HandleServiceError(error);
    }
  }

  async updateAccessRequestStatus(data: UpdateAccessRequestStatusDTO): Promise<IAccessRequest> {
    try {
      const accessRequest = await this.prismaClient.accessRequest.update({
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
      console.error('Error in updateAccessRequestStatus', error);
      throw HandleServiceError(error);
    }
  }
} 