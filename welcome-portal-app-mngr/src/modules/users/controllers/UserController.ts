import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { sendHttpError } from '../../../utils/ErrorHandler';

export class UserController {
  private readonly userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  async GetAllUsers(req: Request, res: Response)  {
      try {
        const users = await this.userService.getAllUsers({
          team: 'team'
        });
        res.status(200).json(users);
      } catch (error) {
        sendHttpError(res, error);
      }
  }
}
