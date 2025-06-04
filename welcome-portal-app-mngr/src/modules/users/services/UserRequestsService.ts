import { PrismaClient } from '@prisma/client';
import { CreateUserRequestDTO, GetAllUserRequestsOptions, IUserRequest, RequestStatus, UpdateUserRequestStatusDTO } from '../models/UserRequest';
import { HandleServiceError } from '../../../utils/ErrorHandler';
const prisma = new PrismaClient();

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
      console.error('Error in createUserRequest', error);
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
      console.error('Error in getAllUserRequests', error);
      throw HandleServiceError(error)
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
      console.error('Error in updateUserRequestStatus', error);
      throw HandleServiceError(error)
    }
  }
} 