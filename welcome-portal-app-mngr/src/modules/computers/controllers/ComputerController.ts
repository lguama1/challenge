import { Request, Response, Router } from 'express';
import { ComputerService } from '../services/ComputerService';
import OpenApiValidatorProvider from '../../../utils/OpenApiValidatorProvider';
import { sendHttpError } from '../../../utils/ErrorHandler';

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
      sendHttpError(res, error)
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
      sendHttpError(res, error)
    }
  }
)

export { ComputerController };
