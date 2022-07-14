import { injectable, inject } from 'inversify';
import { BidSemaphoreService } from '../bid-semaphore/bid-semaphore.service';
import { ValidateTokenService } from '../../auth';

@injectable()
export class AddBidService {

    constructor(
        @inject(BidSemaphoreService) private bidSemaphoreService: BidSemaphoreService,
        @inject(ValidateTokenService) private validateTokenService: ValidateTokenService,
    ) { }

    public async addBid(item: string, sessionKey: string, amount: string) {
        const floatAmount = parseFloat(amount)
        if (isNaN(floatAmount)) {
            throw 'Invalid amount';
        }
        const user = this.validateTokenService.getUserByToken(sessionKey);
        await this.bidSemaphoreService.addBid(item, user, floatAmount);
    }

}
