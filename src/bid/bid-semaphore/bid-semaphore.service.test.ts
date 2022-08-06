import { BidSemaphoreService } from './bid-semaphore.service';
import { BidManagerService } from '../bid-manager/bid-manager.service';

describe('BidSemaphoreService', () => {

    let bidSemaphoreService: BidSemaphoreService;
    let bidManagerService: BidManagerService;
    let user: string;
    let item: string;
    let amount: number;

    beforeEach(() => {
        bidManagerService = new BidManagerService();
        bidSemaphoreService = new BidSemaphoreService(bidManagerService);
        amount = Math.random() * 1000;
        item = Math.random().toString(36).slice(2, 10);
        user = Math.random().toString(36).slice(2, 10);
    });

    afterEach(() => { });

    it('add bid with semaphore', () => {
        expect(bidSemaphoreService.addBid(item, user, amount)).resolves.toBeUndefined();
    });

});