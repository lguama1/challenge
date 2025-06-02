import { Request, Response, Router } from 'express';
import { AccessRequestsService } from '../services/AccessRequestsService';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';

const AccessRequestsController = Router();
const validator = OpenApiValidatorProvider.getValidator();

AccessRequestsController.post(
  '/access-requests',
  validator.validate('post', '/v1/access-requests'),
  async (req: Request, res: Response) => {
    try {
      const { email, requestedAccess } = req.body;

      const accessRequest = await AccessRequestsService.createAccessRequest({
        email: email,
        requestedAccess
      });

      res.status(201).json(accessRequest);
    } catch (error) {
      console.error('Error in createAccessRequest controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
)

AccessRequestsController.patch(
  '/access-requests/:id',
  validator.validate('patch', '/v1/access-requests/:id'),
  async (req: Request, res: Response) => {
    try {
    const { id } = req.params;
    const { status } = req.body;

    const accessRequest = await AccessRequestsService.updateAccessRequestStatus({
      id,
      status
    });

      res.status(200).json(accessRequest);
    } catch (error) {
      console.error('Error in updateAccessRequestStatus controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
})

export { AccessRequestsController };