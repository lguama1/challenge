import { Request, Response, Router } from 'express';
import { UserService } from '../services/UserService';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';

const UserController = Router();
const validator = OpenApiValidatorProvider.getValidator();

UserController.get(
  '/users',
  validator.validate('get', '/v1/users'),
  async (req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers({
        team: 'team' // TODO: obtain from token
      });
      res.status(200).json(users);
    } catch (error) {
      console.error('Error in getAllUsers controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
}
)

export { UserController };
