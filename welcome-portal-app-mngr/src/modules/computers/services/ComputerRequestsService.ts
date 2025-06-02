import { PrismaClient } from '@prisma/client';
import { IComputerRequest, IComputerRequestResponse, RequestStatus } from '../models/IComputerRequest';
import { UserService } from '../../users/services/UserService';
import { IUser } from '../../users/models/User';

const prisma = new PrismaClient();

interface CreateComputerRequestDTO {
  email: string;
  requestedSystem: string;
}

interface GetAllComputerRequestsOptions {
  team: string;
}

interface UpdateComputerRequestStatusDTO {
  id: string;
  status: RequestStatus.APPROVED | RequestStatus.REJECTED;
}

export class ComputerRequestsService {
  public static async createComputerRequest(data: CreateComputerRequestDTO): Promise<IComputerRequest> {
    try {
      const user = await UserService.getUserByEmail(data.email);
      if (!user) {
        throw new Error('User not found');
      }

      const computerRequest = await prisma.computerRequest.create({
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
      throw new Error(`Error creating computer request: ${error}`);
    }
  }

  public static async getAllComputerRequests(options: GetAllComputerRequestsOptions): Promise<IComputerRequestResponse[]> {
    try {
      const { team } = options;
      
      const users = await UserService.getAllUsers({ team });

      const usersMap = users.reduce<Record<string, IUser>>((acc, user) => {
        acc[user.id] = user
        return acc
      }, {})


      const computerRequests = await prisma.computerRequest.findMany({
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
      throw new Error(`Error fetching computer requests: ${error}`);
    }
  }

  public static async updateComputerRequestStatus(data: UpdateComputerRequestStatusDTO): Promise<IComputerRequest> {
    try {
        const result = await prisma.$transaction(async (tx) => {
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
            
            const computer = await tx.computer.findFirst({
                where: {
                  operatingSystem: computerRequest.requestedSystem
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
      throw new Error(`Error updating computer request status: ${error}`);
    }
  }
} 