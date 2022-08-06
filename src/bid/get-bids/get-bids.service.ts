import { inject, injectable } from 'inversify';
import { BidManagerService } from '../bid-manager/bid-manager.service';

@injectable()
export class GetBidsService {

    constructor(
        @inject(BidManagerService) private bidManager: BidManagerService,
    ) { }

    public getBids(item: string) {
        const originalBids = this.bidManager.getBids(item);
        return originalBids.map(bd => {
            const obj = { };
            obj[bd.user] = bd.amount;
            return obj;
        });
    }

}
