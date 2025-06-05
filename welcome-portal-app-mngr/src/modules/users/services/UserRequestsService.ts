import { PrismaClient } from '@prisma/client';
import { CreateUserRequestDTO, GetAllUserRequestsOptions, IUserRequest, RequestStatus, UpdateUserRequestStatusDTO } from '../models/UserRequest';
import { HandleServiceError } from '../../../utils/ErrorHandler';

export class UserRequestsService {
  private readonly prismaClient: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prismaClient = prisma;
  }

  async createUserRequest(data: CreateUserRequestDTO) : Promise<IUserRequest> {
    try {
      const userRequest = await this.prismaClient.userRequest.create({
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
      console.error('Error in createUserRequest', error);
      throw new Error(`Error creating user request: ${error}`);
    }
  }

  async getAllUserRequests(options: GetAllUserRequestsOptions): Promise<IUserRequest[]> {
    try {
      const { team } = options;
      const userRequests = await this.prismaClient.userRequest.findMany({
        where: {
          team: team
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return userRequests as IUserRequest[];
    } catch (error) {
      console.error('Error in getAllUserRequests', error);
      throw HandleServiceError(error);
    }
  }

  async updateUserRequestStatus(data: UpdateUserRequestStatusDTO): Promise<IUserRequest> {
    try {
      const result = await this.prismaClient.$transaction(async (tx) => {
        const userRequest = await tx.userRequest.update({
          where: {
            id: data.id
          },
          data: {
            status: data.status as RequestStatus
          }
        });
    
        if (data.status !== "approved") {
          return  { userRequest };
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
        return { userRequest, user };
      })

      return result.userRequest as IUserRequest;
    } catch (error) {
      console.error('Error in updateUserRequestStatus', error);
      throw HandleServiceError(error)
    }
  }
} 