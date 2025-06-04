import { Request, Response, Router } from 'express';
import { UserService } from '../services/UserService';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';
import { sendHttpError } from '../../../utils/ErrorHandler';

const UserController = Router();
const validator = OpenApiValidatorProvider.getValidator();

UserController.get(
  '/users',
  validator.validate('get', '/v1/users'),
  async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers({
        team: 'team'
      });
      res.status(200).json(users);
    } catch (error) {
      sendHttpError(res, error)
    }
}
)

export { UserController };
