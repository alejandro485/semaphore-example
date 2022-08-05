jest.mock('../../config', () => ({ TTL_TOKENS: 5000 }));
import { TTL_TOKENS } from '../../config';
import { TokenManagerService } from './token-manager.service';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('TokenManagerService', () => {

    let tokenManagerService: TokenManagerService;
    let tokenUserPairs: { user: string, token: string }[];

    beforeEach(() => {
        jest.resetModules();
        tokenManagerService = new TokenManagerService();
        tokenUserPairs = []

        const totalUsers = 10
        for (let i=0; i < totalUsers; i++) {
            const token = Math.random().toString(36).slice(2);
            const user = Math.random().toString(36).slice(2,10);
            tokenUserPairs.push({
                user, token,
            })
        }
    });

    afterEach(() => {
        tokenManagerService.unsetAll();
    });

    it('register session', () => {
        const testData = tokenUserPairs[0];
        tokenManagerService.addToken(testData.token, testData.user);
        const userResponse = tokenManagerService.getToken(testData.token,);
        expect(userResponse).toEqual(testData.user);
    });

    it('register multiple sessions', () => {
        tokenUserPairs.forEach(tup => {
            tokenManagerService.addToken(tup.token, tup.user);
        });
        tokenUserPairs.forEach(tup => {
            expect(tokenManagerService.getToken(tup.token)).toEqual(tup.user);
        });
    });

    it('register multiple sessions and evaluate them frequently', async () => {
        tokenUserPairs.forEach(tup => {
            tokenManagerService.addToken(tup.token, tup.user);
        });
        for(let i = 0; i < 4; i++) {
            tokenUserPairs.forEach(tup => {
                expect(tokenManagerService.getToken(tup.token)).toEqual(tup.user);
            });
            await sleep(1000);
        }
    }, TTL_TOKENS * 2);

    it('expiration token', async () => {
        const tup = tokenUserPairs[0];
        tokenManagerService.addToken(tup.token, tup.user);
        await sleep(TTL_TOKENS);
        const user = tokenManagerService.getToken(tup.token)
        expect(user).toBeUndefined();
    }, TTL_TOKENS * 2);

});
