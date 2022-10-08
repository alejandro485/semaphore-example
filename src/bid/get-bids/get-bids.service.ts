import { inject, injectable } from 'inversify';
import { BidManagerService } from '../bid-manager/bid-manager.service';

@injectable()
export class GetBidsService {

    constructor(
        @inject(BidManagerService) private bidManager: BidManagerService,
    ) { }

    public getBids(item: string) {
        return this.bidManager.getBids(item);
    }

}
