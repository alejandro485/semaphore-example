import { injectable, inject } from 'inversify';
import { TokenManagerService } from '../token-manager/token-manager.service';

@injectable()
export class ValidateTokenService {

    constructor(
        @inject(TokenManagerService) private tokenManagerService: TokenManagerService,
    ) { }

    public validateToken(token: string) {
        return Boolean(this.tokenManagerService.getToken(token));
    } 

    public getUserByToken(token: string) {
        return this.tokenManagerService.getToken(token);
    }

}
