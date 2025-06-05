import { Request, Response } from 'express';
import { ComputerRequestsService } from '../services/ComputerRequestsService';
import { RequestStatus } from '../models/IComputerRequest';
import { sendHttpError } from '../../../utils/ErrorHandler';

export class ComputerRequestsController {
  private readonly computerRequestsService: ComputerRequestsService;

  constructor(computerRequestsService: ComputerRequestsService) {
    this.computerRequestsService = computerRequestsService;
  }

  async CreateComputerRequest(req: Request, res: Response) {
    try {
      const { email, requestedSystem } = req.body;
      if (!email || !requestedSystem) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Email and requested system are required'
        });
      };

      const computerRequest = await this.computerRequestsService.createComputerRequest({
        email,
        requestedSystem
      });

      res.status(201).json(computerRequest);
    } catch (error) {
      sendHttpError(res, error);
    }
  }

  async UpdateComputerRequestStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Status is required'
        });
      };

      if (status !== RequestStatus.APPROVED && status !== RequestStatus.REJECTED) {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Status must be either "approved" or "rejected"'
        });
      };

      const computerRequest = await this.computerRequestsService.updateComputerRequestStatus({
        id,
        status
      });
      res.status(200).json(computerRequest);
    } catch (error) {
      sendHttpError(res, error);
    }
  }
}
