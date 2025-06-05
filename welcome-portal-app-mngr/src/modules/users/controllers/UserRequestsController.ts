import { Request, Response } from 'express';
import { UserRequestsService } from '../services/UserRequestsService';
import { sendHttpError } from '../../../utils/ErrorHandler';

export class UserRequestsController {
  private readonly userRequestsService: UserRequestsService;

  constructor(userRequestsService: UserRequestsService) {
    this.userRequestsService = userRequestsService;
  }

  async CreateUserRequest(req: Request, res: Response)  {
    try {
      const { name, email, area, role } = req.body;
      const userRequest = await this.userRequestsService.createUserRequest({
        name,
        email,
        area,
        role,
        team: 'team'
      });
      res.status(201).json(userRequest);
    } catch (error) {
      sendHttpError(res, error);
    }
  }

  async UpdateUserRequestStatus(req: Request, res: Response)  {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const userRequest = await this.userRequestsService.updateUserRequestStatus({
        id,
        status
      });

      res.status(200).json(userRequest);
    } catch (error) {
      sendHttpError(res, error);
    }
  }
}

