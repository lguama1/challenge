import { Request, Response, Router } from 'express';
import { UserRequestsService } from '../services/UserRequestsService';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';

const UserRequestsController = Router();
const validator = OpenApiValidatorProvider.getValidator();

UserRequestsController.post(
  '/user-requests',
  validator.validate('post', '/v1/user-requests'),
  async (req: Request, res: Response) => {
    try {
      // TODO extract team
      const { name, email, area, role } = req.body;
      const userRequest = await UserRequestsService.createUserRequest({
        name,
        email,
        area,
        role,
        team: 'team'
      });

      res.status(201).json(userRequest);
    } catch (error) {
      console.error('Error in createUserRequest controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
)

UserRequestsController.patch(
  '/user-requests/:id',
  validator.validate('patch', '/v1/user-requests/{id}'),
  async (req: Request, res: Response) =>{
    try {
      const { id } = req.params;
      const { status } = req.body;

      const userRequest = await UserRequestsService.updateUserRequestStatus({
        id,
        status
      });

      res.status(200).json(userRequest);
    } catch (error) {
      console.error('Error in updateUserRequestStatus controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
)

export { UserRequestsController };
