import { injectable, inject } from 'inversify';
import { TokenManagerService } from '../token-manager/token-manager.service';

@injectable()
export class LoginService {

    constructor(
        @inject(TokenManagerService) private tokenManagerService: TokenManagerService,
    ) { }

    public login(user: string) {
        const token = Math.random().toString(36).slice(2);
        this.tokenManagerService.addToken(token, user);
        return token;
    }

}
