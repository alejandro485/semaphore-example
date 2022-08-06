import { BidManagerService } from './bid-manager.service';
import { BIDS_LIMIT } from '../../config';

describe('BidManagerService', () => {

    let bidManagerService: BidManagerService;
    let user: string;
    let item: string;
    let amount: number;

    beforeEach(() => {
        bidManagerService = new BidManagerService();
        amount = Math.random() * 1000;
        item = Math.random().toString(36).slice(2, 10);
        user = Math.random().toString(36).slice(2, 10);
    });

    afterEach(() => { });

    it('bids for nonexistent item', () => {
        const bids = bidManagerService.getBids(item);
        expect(bids).toBeDefined();
        expect(bids.length).toEqual(0);
    });


    it('add bid', () => {
        bidManagerService.addBid(item, user, amount);
        const bids = bidManagerService.getBids(item);
        const bid = bids[0];

        expect(bids.length).toEqual(1);
        expect(bid).toBeDefined();
        expect(bid.user).toEqual(user);
        expect(bid.amount).toEqual(amount);
    });

    it('multiple bid adds', () => {
        const amounts: number[] = []
        for (let i = 0; i < BIDS_LIMIT; i++) {
            amount = Math.random() * 1000;
            user = Math.random().toString(36).slice(2, 10);
            bidManagerService.addBid(item, user, amount);
            amounts.push(amount);
        }
        const bids = bidManagerService.getBids(item);
        const bid = bids[0];

        expect(bids.length).toEqual(BIDS_LIMIT);
        expect(bid).toBeDefined();
        expect(bid.amount).toEqual(Math.max(...amounts));
    });

    it('multiple bid adds by user', () => {
        const amounts: number[] = []
        for (let i = 0; i < BIDS_LIMIT; i++) {
            amount = Math.random() * 1000;
            bidManagerService.addBid(item, user, amount);
            amounts.push(amount);
        }
        const bids = bidManagerService.getBids(item);
        const bid = bids[0];

        expect(bids.length).toEqual(1);
        expect(bid).toBeDefined();
        expect(bid.user).toEqual(user);
        expect(bid.amount).toEqual(Math.max(...amounts));
    });

    it('exceed limit per item', () => {
        const amounts: number[] = []
        for (let i = 0; i < BIDS_LIMIT * 2; i++) {
            amount = Math.random() * 1000;
            user = Math.random().toString(36).slice(2, 10);
            bidManagerService.addBid(item, user, amount);
            amounts.push(amount);
        }
        const bids = bidManagerService.getBids(item);
        const bid = bids[0];

        expect(bids.length).toEqual(BIDS_LIMIT);
        expect(bid).toBeDefined();
        expect(bid.amount).toEqual(Math.max(...amounts));
    });

});
