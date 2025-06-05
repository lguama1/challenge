import { Request, Response } from 'express';
import { AccessRequestsService } from '../services/AccessRequestsService';
import { sendHttpError } from '../../../utils/ErrorHandler';

export class AccessRequestController {
  private readonly accessRequestsService: AccessRequestsService;

  constructor(accessRequestsService: AccessRequestsService) {
    this.accessRequestsService = accessRequestsService;
  }

  async CreateAccessRequest(req: Request, res: Response) {
    try {
      const { email, requestedAccess } = req.body;
      const accessRequest = await this.accessRequestsService.createAccessRequest({
        email: email,
        requestedAccess
      });
      res.status(201).json(accessRequest);
    } catch (error) {
      sendHttpError(res, error);
    }
  }

  async UpdateAccessRequestStatus(req: Request, res: Response) {
    try {
    const { id } = req.params;
    const { status } = req.body;
    const accessRequest = await this.accessRequestsService.updateAccessRequestStatus({
      id,
      status
    });
      res.status(200).json(accessRequest);
    } catch (error) {
      sendHttpError(res, error);
    }
  }
}
