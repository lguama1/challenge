import { PrismaClient } from '@prisma/client';
import { CreateComputerRequestDTO, GetAllComputerRequestsOptions, IComputerRequest, IComputerRequestResponse, RequestStatus, UpdateComputerRequestStatusDTO } from '../models/IComputerRequest';
import { UserService } from '../../users/services/UserService';
import { IUser } from '../../users/models/User';
import { HandleServiceError } from '../../../utils/ErrorHandler';

export class ComputerRequestsService {
  private readonly prismaClient: PrismaClient;
  private readonly userService: UserService;

  constructor(
    prisma: PrismaClient,
    userService: UserService
  ) {
    this.prismaClient = prisma;
    this.userService = userService;
  }

  async createComputerRequest(data: CreateComputerRequestDTO): Promise<IComputerRequest> {
    try {
      const user = await this.userService.getUserByEmail(data.email);

      const computerRequest = await this.prismaClient.computerRequest.create({
        data: {
          userId: user.id,
          requestedSystem: data.requestedSystem,
          team: user.team,
          status: RequestStatus.PENDING
        },
      });

      return {
        ...computerRequest,
        status: computerRequest.status as RequestStatus
      };
    } catch (error) {
      console.error('Error in createComputerRequest', error);
      throw HandleServiceError(error);  
    }
  }

  async getAllComputerRequests(options: GetAllComputerRequestsOptions): Promise<IComputerRequestResponse[]> {
    try {
      const { team } = options;
      const users = await this.userService.getAllUsers({ team });

      const usersMap = users.reduce<Record<string, IUser>>((acc, user) => {
        acc[user.id] = user
        return acc
      }, {})

      const computerRequests = await this.prismaClient.computerRequest.findMany({
        where: {
          team: team
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return computerRequests.map(request => ({
        email: usersMap[request.userId].email,
        ...request,
        status: request.status as RequestStatus
      }));
    } catch (error) {
      console.error('Error in getAllComputerRequests', error);
      throw HandleServiceError(error);
    }
  }

  async updateComputerRequestStatus(data: UpdateComputerRequestStatusDTO): Promise<IComputerRequest> {
    try {
      const result = await this.prismaClient.$transaction(async (tx) => {
        const computerRequest = await tx.computerRequest.update({
          where: {
            id: data.id
          },
          data: {
            status: data.status
          }
        });

        if (computerRequest.status !== "approved") {
          return  computerRequest  
        }

        const computersAssignment = await tx.computerAssignment.findMany();
        const excludedComputerIds = computersAssignment.map(computer => computer.computerId);
        const computer = await tx.computer.findFirst({
          where: {
            operatingSystem: computerRequest.requestedSystem,
            id: {
              notIn: excludedComputerIds
            }
          }
        });

        if (computer) {
          await tx.computerAssignment.create({
            data: {
              computerId: computer.id,
              userId: computerRequest.userId,
            }
          });
        }
        return computerRequest
      })

      return {
        ...result,
        status: result.status as RequestStatus
      };
    } catch (error) {
      console.error('Error in updateComputerRequestStatus', error);
      throw HandleServiceError(error);
    }
  }
} 