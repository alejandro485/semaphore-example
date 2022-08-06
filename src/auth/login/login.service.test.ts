import { LoginService } from './login.service'
import { TokenManagerService } from '../token-manager/token-manager.service'

describe('LoginService', () => {

    let loginService: LoginService;
    let tokenManagerService: TokenManagerService;

    beforeEach(() => {
        tokenManagerService = new TokenManagerService();
        loginService = new LoginService(tokenManagerService);
    });

    afterEach(() => { });

    it('basic login', () => {
        const user = Math.random().toString(36).slice(2, 10);
        const token = loginService.login(user)
        expect(token).toMatch(/^[0-9a-z]*/g)
    });

    it('generate unique tokens', () => {
        const attempts = 10;
        const tokens: string[] = []

        for (let i = 0; i < attempts; i++) {
            const user = Math.random().toString(36).slice(2, 10);
            tokens.push(loginService.login(user));
        }
        expect((new Set(tokens).size === tokens.length)).toBeTruthy();
    });

});
