import { ContainerModule } from 'inversify';
import { AddBidService } from './add-bid/add-bid.service';
import { BidManagerService } from './bid-manager/bid-manager.service';
import { BidSemaphoreService } from './bid-semaphore/bid-semaphore.service';
import { GetBidsService } from './get-bids/get-bids.service';

export const BidContainer = new ContainerModule((bind) => {
    bind<AddBidService>(AddBidService).to(AddBidService).inSingletonScope();
    bind<BidManagerService>(BidManagerService).to(BidManagerService).inSingletonScope();
    bind<GetBidsService>(GetBidsService).to(GetBidsService).inSingletonScope();
    bind<BidSemaphoreService>(BidSemaphoreService).to(BidSemaphoreService).inSingletonScope();
});
