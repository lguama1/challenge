import { Request, Response } from 'express';
import { ComputerService } from '../services/ComputerService';
import { sendHttpError } from '../../../utils/ErrorHandler';

export class ComputerController {
  private readonly computerService: ComputerService;

  constructor(computerService: ComputerService) {
    this.computerService = computerService;
  }

  async GetAllComputers (req: Request, res: Response) {
    try {
      const computers = await this.computerService.getAllComputers();
      res.status(200).json(computers);
    } catch (error) {
      sendHttpError(res, error);
    }
  }
  async GetAllComputersForTeam(req: Request, res: Response) {
    try {
      const computers = await this.computerService.getAllComputersForTeam({
        team: 'team'
      });
      res.status(200).json(computers);
    } catch (error) {
      sendHttpError(res, error);
    }
  }
}
