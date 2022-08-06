import { GetBidsService } from './get-bids.service';
import { BidManagerService } from '../bid-manager/bid-manager.service';
import { BIDS_LIMIT } from '../../config';

describe('GetBidsService', () => {

    let getBidsService: GetBidsService;
    let bidManagerService: BidManagerService;
    let item: string;

    beforeEach(() => {
        bidManagerService = new BidManagerService();
        getBidsService = new GetBidsService(bidManagerService);
        item = Math.random().toString(36).slice(2, 10);

        const totalBids = Math.round(Math.random() * BIDS_LIMIT) + 5;
        for (let i=0; i< totalBids; i++) {
            const amount = Math.random() * 1000;
            const user = Math.random().toString(36).slice(2, 10);
            bidManagerService.addBid(item, user, amount);
        }
    });

    afterEach(() => { });

    it('total bids on item', () => {
        expect(getBidsService.getBids(item).length).toBeLessThanOrEqual(BIDS_LIMIT)
    });

    it('max bid on item', () => {
        const user = Math.random().toString(36).slice(2, 10);
        bidManagerService.addBid(item, user, 10000);

        const bids = getBidsService.getBids(item);
        expect(bids[0][user]).toBe(10000);
    });

    it('list multiple bid by user', () => {
        item = Math.random().toString(36).slice(2, 10);
        const amounts: number[] = []
        const user = Math.random().toString(36).slice(2, 10);
        for (let i = 0; i < BIDS_LIMIT; i++) {
            const amount = Math.random() * 1000;
            bidManagerService.addBid(item, user, amount);
            amounts.push(amount);
        }
        const bids = getBidsService.getBids(item);
        const bid = bids[0];

        expect(bids.length).toBe(1);
        expect(bid).toBeDefined();
        expect(bid[user]).toBeDefined();
        expect(bid[user]).toBe(Math.max(...amounts));
    });

    it('users with amount', () => {
        item = Math.random().toString(36).slice(2, 10);
        const bidsAdded: any[] = [] 
        for (let i = 0; i < BIDS_LIMIT; i++) {
            const user = Math.random().toString(36).slice(2, 10);
            const amount = Math.random() * 1000;
            bidManagerService.addBid(item, user, amount);

            const obj = { };
            obj[user] = amount;
            bidsAdded.push(obj);
        }

        const bids = getBidsService.getBids(item);
        expect(bids.length).toBe(BIDS_LIMIT);
        expect(bids).toEqual(expect.arrayContaining(bidsAdded));
    });

});
