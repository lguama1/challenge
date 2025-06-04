import { Request, Response, Router } from 'express';
import { ComputerRequestsService } from '../services/ComputerRequestsService';
import { RequestStatus } from '../models/IComputerRequest';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';
import { sendHttpError } from '../../../utils/ErrorHandler';

const ComputerRequestsController = Router();
const validator = OpenApiValidatorProvider.getValidator();

ComputerRequestsController.post(
  '/computer-requests',
  validator.validate('post', '/v1/computer-requests'),
  async (req: Request, res: Response) => {
    try {
      const { email, requestedSystem } = req.body;

      if (!email || !requestedSystem) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Email and requested system are required'
        });
      }

      const computerRequest = await ComputerRequestsService.createComputerRequest({
        email,
        requestedSystem
      });

      res.status(201).json(computerRequest);
    } catch (error) {
      sendHttpError(res, error)
    }
  }
)

ComputerRequestsController.patch(
  '/computer-requests/:id',
  validator.validate('patch', '/v1/computer-requests/{id}'),
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Status is required'
        });
      }

      if (status !== RequestStatus.APPROVED && status !== RequestStatus.REJECTED) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Status must be either "approved" or "rejected"'
        });
      }

      const computerRequest = await ComputerRequestsService.updateComputerRequestStatus({
        id,
        status
      });

      res.status(200).json(computerRequest);
    } catch (error) {
      sendHttpError(res, error)
    }
  }
)

export { ComputerRequestsController };
