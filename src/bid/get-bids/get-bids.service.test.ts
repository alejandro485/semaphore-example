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
        bidManagerService.addBid(item, user, 10000)
        const bids = getBidsService.getBids(item)
        expect(bids[0][user]).toEqual(10000)
    });

});
