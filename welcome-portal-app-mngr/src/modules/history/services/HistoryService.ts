import { AccessRequestsService } from '../../access-requests/services/AccessRequestsService';
import { ComputerRequestsService } from '../../computers/services/ComputerRequestsService';
import { UserRequestsService } from '../../users/services/UserRequestsService';
import { GetAllHistoryOptions, IHistoryResponse } from '../models/IHistoryResponse';

export class HistoryService {
  public static async getAllRequests(options: GetAllHistoryOptions): Promise<IHistoryResponse[]> {
    try {
      const { team } = options;

      // Get all requests from different services
      const [accessRequests, computerRequests, userRequests] = await Promise.all([
        AccessRequestsService.getAllAccessRequests({ team }),
        ComputerRequestsService.getAllComputerRequests({ team }),
        UserRequestsService.getAllUserRequests({ team })
      ]);

      const accessRequestsHistory = accessRequests.map(request => ({
        owner: request.email,
        userId: request.userId,
        typeOfRequest: 'access',
        createdAt: request.createdAt,
        status: request.status,
        id: request.id,
      }));

      const computerRequestsHistory = computerRequests.map(request => ({
        owner: request.email,
        typeOfRequest: 'computer',
        userId: request.userId,
        createdAt: request.createdAt,
        status: request.status,
        id: request.id
      }));

      const userRequestsHistory = userRequests.map(request => ({
        owner: request.email,
        typeOfRequest: 'user',
        userId: request.id,
        createdAt: request.createdAt,
        status: request.status,
        id: request.id
      }));

      const allRequests = [
        ...accessRequestsHistory,
        ...computerRequestsHistory,
        ...userRequestsHistory
      ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      return allRequests;
    } catch (error) {
      throw new Error(`Error fetching request history: ${error}`);
    }
  }
} 