import { Request, Response } from 'express';
import { HistoryService } from '../services/HistoryService';
import { sendHttpError } from '../../../utils/ErrorHandler';

export class HistoryController {
  private readonly historyService: HistoryService;

  constructor(historyService: HistoryService) {
    this.historyService = historyService;
  }

  async GetAllRequests(req: Request, res: Response) {
    try {
      const requests = await this.historyService.getAllRequests({
        team: 'team'
      });
      res.status(200).json(requests);
    } catch (error) {
      sendHttpError(res, error);
    }
  }
}
