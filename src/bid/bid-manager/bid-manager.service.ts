import { injectable } from 'inversify';
import { BIDS_LIMIT } from '../../config';

@injectable()
export class BidManagerService {

    private items: { [item: string]: { user: string, amount: number }[] };

    constructor() {
        this.items = { };
    }

    public addBid(item: string, user: string, amount: number) {
        console.log(`bid: ${item}`)
        if (!this.items[item]) {
            this.items[item] = [];
        }
        const userIndex = this.items[item].findIndex(it => it.user === user && it.amount < amount);
        if (userIndex > -1) {
            this.items[item][userIndex].amount = amount;
        } else {
            this.items[item].push({
                user, amount,
            });
            this.items[item] = this.items[item].sort((it1, it2) => it2.amount - it1.amount).slice(0, BIDS_LIMIT);
        }
    }

    public getBids(item: string) {
        if (!this.items[item]) {
            this.items[item] = [];
        }
        return this.items[item];
    }

}
