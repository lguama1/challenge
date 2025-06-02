import debugLib from 'debug';
import { Request, Response, NextFunction } from 'express';

const debug = debugLib('bdb:TransformErrors');

export default class TransformErrors {
    public static parseErrors(err: any, req: Request, res: Response, next: NextFunction) {
        const requestUid = req.headers['x-rquid'] as string;
        const statusCode = err.statusCode || 500;

        const isValidation = Array.isArray(err?.data);
        const validationDetails = isValidation ? err.data : undefined;

        const result = {
            error: err.name || 'Error',
            message: err.message?.toString() || '',
            statusCode: statusCode,
            ...(validationDetails && { details: validationDetails} ),
            endDt: new Date().toISOString()
        };

        debug('<%s> An error has ocurred: %j', requestUid, result);
        res.status(statusCode).json(result);
    }
}
