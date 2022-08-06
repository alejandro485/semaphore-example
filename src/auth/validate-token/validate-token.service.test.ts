jest.mock('../../config', () => ({ TTL_TOKENS: 5000 }));
import { TTL_TOKENS } from '../../config';
import { ValidateTokenService } from './validate-token.service';
import { TokenManagerService } from '../token-manager/token-manager.service';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('ValidateTokenService', () => {

    let tokenManagerService: TokenManagerService;
    let validateTokenService: ValidateTokenService;
    let tokenUserPairs: { user: string, token: string }[];

    beforeEach(() => {
        jest.resetModules();
        tokenManagerService = new TokenManagerService();
        validateTokenService = new ValidateTokenService(tokenManagerService);
        tokenUserPairs = []

        const totalUsers = 10
        for (let i = 0; i < totalUsers; i++) {
            const token = Math.random().toString(36).slice(2);
            const user = Math.random().toString(36).slice(2, 10);
            tokenUserPairs.push({
                user, token,
            })
        }
    });

    afterEach(() => {
        tokenManagerService.unsetAll();
    });

    it('validate nonexistent token', () => {
        const tup = tokenUserPairs[0];
        expect(validateTokenService.validateToken(tup.token)).not.toBeTruthy();
    });

    it('get user by nonexistent token', () => {
        const tup = tokenUserPairs[0];
        const user = validateTokenService.getUserByToken(tup.token);
        expect(user).toBeUndefined();
    });

    it('validate token', () => {
        const testData = tokenUserPairs[0];
        tokenManagerService.addToken(testData.token, testData.user);
        const userResponse = validateTokenService.validateToken(testData.token);
        expect(userResponse).toBeTruthy();
    });

    it('get user by token', () => {
        const testData = tokenUserPairs[0];
        tokenManagerService.addToken(testData.token, testData.user);
        const userResponse = validateTokenService.getUserByToken(testData.token);
        expect(userResponse).toBe(testData.user);
    });

    it('validate expirated token', async () => {
        const tup = tokenUserPairs[0];
        tokenManagerService.addToken(tup.token, tup.user);
        await sleep(TTL_TOKENS);
        expect(validateTokenService.validateToken(tup.token)).not.toBeTruthy();
    }, TTL_TOKENS * 2);

});
