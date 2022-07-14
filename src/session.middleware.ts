import { Request, Response, NextFunction } from 'express';
import { AppContainer, ValidateTokenService } from './app.container';

export const sessionMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const validateTokenService = AppContainer.get<ValidateTokenService>(ValidateTokenService);
    const sessionKey = String(req.query.sessionKey);
    if (validateTokenService.validateToken(sessionKey)) {
        next();
    } else {
        res.status(400).send('auth required');
    }
};
