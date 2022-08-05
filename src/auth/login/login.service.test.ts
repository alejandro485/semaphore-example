import { LoginService } from './login.service'
import { TokenManagerService } from '../token-manager/token-manager.service'

describe('LoginService', () => {

    let loginService: LoginService;
    let tokenManagerService: TokenManagerService;

    const users = ['paco', 'luis', 'pedro', 'juan']

    beforeEach(() => {
        tokenManagerService = new TokenManagerService();
        loginService = new LoginService(tokenManagerService);
    });

    afterEach(() => {
        tokenManagerService.unsetAll()
    });

    it('basic login', () => {
        const user = users[Math.round(Math.random() * (users.length - 1))];
        const token = loginService.login(user)
        expect(token).toMatch(/^[0-9a-z]*/g)
    });

    it('generate unique tokens', () => {
        const attempts = 10;
        const tokens: string[] = []

        for (let i=0; i < attempts; i++) {
            const user = users[Math.round(Math.random() * (users.length - 1))];
            tokens.push(loginService.login(user));
        }
        expect((new Set(tokens).size === tokens.length)).toBeTruthy();
    });

});
