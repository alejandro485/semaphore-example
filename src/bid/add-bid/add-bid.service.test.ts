jest.mock('../../config', () => ({ TTL_TOKENS: 5000, BIDS_LIMIT: 15, MAX_CONCURRENT_ADDS: 1 }));
import { AddBidService } from './add-bid.service';
import { LoginService } from '../../auth/login/login.service';
import { AppContainer } from '../../app.container';

describe('AddBidService', () => {

    let addBidService: AddBidService;
    let loginService: LoginService;
    let token: string;
    let item: string;

    beforeEach(() => {
        jest.resetModules();
        AppContainer.snapshot();
        addBidService = AppContainer.get<AddBidService>(AddBidService);
        loginService = AppContainer.get<LoginService>(LoginService);

        item = Math.random().toString(36).slice(2, 6);
        token = loginService.login(Math.random().toString(36).slice(2, 10));
    });

    afterEach(() => {
        AppContainer.restore();
    });

    it('should be defined', async () => {
        expect(addBidService).toBeDefined();
        expect(loginService).toBeDefined();
    });

    it('add bid', () => {
        expect(addBidService.addBid(item, token, (Math.random() * 10).toString())).resolves.toBeUndefined();
    });

    it('bad amount', async () => {
        expect(addBidService.addBid(item, token, 'df323f')).rejects.toEqual('Invalid amount');
    });

});
