import { inject, injectable} from 'inversify';
import { MAX_CONCURRENT_ADDS } from '../../config';
import { BidManagerService } from '../bid-manager/bid-manager.service';

@injectable()
export class BidSemaphoreService {

    private queueJob: any[];
    private runningJobs: number;

    constructor(
        @inject(BidManagerService) private bidManagerService: BidManagerService,
    ) {
        this.queueJob = [];
        this.runningJobs = 0;
    }

    public addBid(item: string, user: string, amount: number) {
        return new Promise((resolve) => {
            this.queueJob.push({
                resolve,
                args: { item, user, amount },
            });
            this.handleJob();
        });
    }

    private async handleJob() {
        if (this.queueJob.length === 0) {
            return;
        } else if (this.runningJobs < MAX_CONCURRENT_ADDS) {
            this.runningJobs++;
            const { resolve, args } = this.queueJob.shift();
            this.bidManagerService.addBid(args.item, args.user, args.amount);
            // await this.sleep(10 * 1000);
            resolve();
            this.runningJobs--;
            this.handleJob();
        }
    }

    private sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

}
