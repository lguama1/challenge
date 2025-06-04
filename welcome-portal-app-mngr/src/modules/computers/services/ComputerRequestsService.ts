import { PrismaClient } from '@prisma/client';
import { CreateComputerRequestDTO, GetAllComputerRequestsOptions, IComputerRequest, IComputerRequestResponse, RequestStatus, UpdateComputerRequestStatusDTO } from '../models/IComputerRequest';
import { UserService } from '../../users/services/UserService';
import { IUser } from '../../users/models/User';
import { HandleServiceError } from '../../../utils/ErrorHandler';

const prisma = new PrismaClient();
export class ComputerRequestsService {
  public static async createComputerRequest(data: CreateComputerRequestDTO): Promise<IComputerRequest> {
    try {
      const user = await UserService.getUserByEmail(data.email);

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
      console.error('Error in createComputerRequest', error);
      throw HandleServiceError(error)    
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
      console.error('Error in getAllComputerRequests', error);
      throw HandleServiceError(error)   
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
      console.error('Error in updateComputerRequestStatus', error);
      throw HandleServiceError(error)   
    }
  }
} 