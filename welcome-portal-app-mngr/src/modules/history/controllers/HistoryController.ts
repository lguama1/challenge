import { Request, Response, Router } from 'express';
import { HistoryService } from '../services/HistoryService';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';

const HistoryController = Router()
const validator = OpenApiValidatorProvider.getValidator();

HistoryController.get(
  '/history/requests',
  validator.validate('get', '/v1/history/requests'),
  async (req: Request, res: Response) =>{
    try {
      const requests = await HistoryService.getAllRequests({
        team: 'team'
      });
       res.status(200).json(requests);
    } catch (error) {
      console.error('Error in getAllRequests controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
)

export { HistoryController };
