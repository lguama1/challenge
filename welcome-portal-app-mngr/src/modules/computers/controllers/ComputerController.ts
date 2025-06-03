import { Request, Response, Router } from 'express';
import { ComputerService } from '../services/ComputerService';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';

const ComputerController = Router();
const validator = OpenApiValidatorProvider.getValidator();

ComputerController.get(
  '/computers',
  //validator.validate('get', '/v1/computers'),
  async (req: Request, res: Response) => {
    try {
      const computers = await ComputerService.getAllComputers();
      res.status(200).json(computers);
    } catch (error) {
      console.error('Error in getAllComputers controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
)

ComputerController.get(
  '/computers/team',
  validator.validate('get', '/v1/computers/team'),
  async (req: Request, res: Response) => {
    try {
      const computers = await ComputerService.getAllComputersForTeam({
        team: 'team'
      });
      res.status(200).json(computers);
    } catch (error) {
      console.error('Error in getAllComputersForTeam controller:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  }
)

export { ComputerController };
